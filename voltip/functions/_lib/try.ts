/**
 * The try page's API: a visitor who passed Turnstile gets a 30-minute session, then sends
 * recordings (16 kHz mono WAV, at most 60 s) and texts to polish. The built-in service's edge does
 * the work; this layer holds its token, sends the visitor's address and keeps the limits:
 * per address and hour 20 recognitions and 10 polishes, for all visitors together per day 300 and
 * 60, so the try page cannot use up the app users' share of the free quota.
 */
import { addressHash, sign, verify } from "./crypto";
import { type Window, bumpAll, DAY, full, HOUR, secondsLeft, sweep } from "./counters";
import type { Deps, Env } from "./env";
import { clientAddress, cookie, fail, json, sameOrigin, setCookie } from "./http";
import { LANGUAGES, MAX_PROMPT_CHARS, MAX_TEXT_CHARS, outputBudget, POLISH_MODELS, PRESETS, systemPrompt, TEMPERATURE } from "./presets";
import { humanVerified } from "./turnstile";

export const SESSION_COOKIE = "vt_try";
export const SESSION_SECONDS = 30 * 60;
export const MAX_SECONDS = 60;
/** 60 s of 16 kHz 16-bit mono plus the header, with a little room. */
export const MAX_WAV_BYTES = 44 + 16_000 * 2 * MAX_SECONDS + 4096;
export const LIMITS = { asrPerHour: 20, polishPerHour: 10, asrPerDay: 300, polishPerDay: 60 } as const;
const DEFAULT_ASR_MODEL = "Qwen/Qwen3-ASR-1.7B";

export function options(env: Env): Response {
  return json({
    asr_model: env.TRY_ASR_MODEL || DEFAULT_ASR_MODEL,
    polish_models: POLISH_MODELS,
    presets: PRESETS.map((p) => p.id),
    languages: LANGUAGES,
    max_seconds: MAX_SECONDS,
    max_prompt_chars: MAX_PROMPT_CHARS,
    limits: LIMITS,
    turnstile_site_key: env.TURNSTILE_SITE_KEY,
  });
}

export async function startSession(request: Request, env: Env, deps: Deps): Promise<Response> {
  if (!sameOrigin(request)) return fail(403, "cross_origin");
  const body = (await request.json().catch(() => null)) as { turnstile?: unknown } | null;
  if (!(await humanVerified(env, deps, body?.turnstile, clientAddress(request)))) return fail(403, "not_verified");
  const token = await sign(env.SESSION_KEY, "try", { exp: deps.now() + SESSION_SECONDS * 1000 });
  return json({ ok: true, expires_in: SESSION_SECONDS }, 200, { "set-cookie": setCookie(request, SESSION_COOKIE, token, "/api/try", SESSION_SECONDS) });
}

async function sessionValid(request: Request, env: Env, deps: Deps): Promise<boolean> {
  const payload = await verify(env.SESSION_KEY, "try", cookie(request, SESSION_COOKIE));
  return typeof payload?.exp === "number" && payload.exp > deps.now();
}

async function windows(env: Env, request: Request, kind: "asr" | "polish"): Promise<Window[]> {
  const who = await addressHash(env.IP_SALT, clientAddress(request) || "none");
  return [
    { key: `try:${kind}:addr:${who}`, ms: HOUR, limit: kind === "asr" ? LIMITS.asrPerHour : LIMITS.polishPerHour },
    { key: `try:${kind}:all`, ms: DAY, limit: kind === "asr" ? LIMITS.asrPerDay : LIMITS.polishPerDay },
  ];
}

/** Refuses when the visitor or the day is over its limit; otherwise counts the request. */
async function admit(env: Env, deps: Deps, request: Request, kind: "asr" | "polish"): Promise<Response | null> {
  const now = deps.now();
  const ws = await windows(env, request, kind);
  const over = await full(env.DB, ws, now);
  if (over) {
    const everyone = over.key.endsWith(":all");
    return fail(429, everyone ? "daily_limit" : "hourly_limit", { retry_after: secondsLeft(over, now) });
  }
  await bumpAll(env.DB, ws, now);
  // Counts of a window that has passed go with the next request (the privacy page says so).
  await sweep(env.DB, now);
  return null;
}

/** Duration of a 16-bit mono PCM WAV at 16 kHz, or null when it is anything else. */
export function wavSeconds(bytes: Uint8Array): number | null {
  if (bytes.length < 44) return null;
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const tag = (at: number) => String.fromCharCode(...bytes.slice(at, at + 4));
  if (tag(0) !== "RIFF" || tag(8) !== "WAVE") return null;
  let at = 12;
  let format: { channels: number; rate: number; bits: number; pcm: boolean } | null = null;
  while (at + 8 <= bytes.length) {
    const id = tag(at);
    const size = view.getUint32(at + 4, true);
    if (id === "fmt " && at + 24 <= bytes.length) {
      format = { pcm: view.getUint16(at + 8, true) === 1, channels: view.getUint16(at + 10, true), rate: view.getUint32(at + 12, true), bits: view.getUint16(at + 22, true) };
    }
    if (id === "data") {
      if (!format || !format.pcm || format.channels !== 1 || format.rate !== 16_000 || format.bits !== 16) return null;
      const length = Math.min(size, bytes.length - at - 8);
      return length / (16_000 * 2);
    }
    at += 8 + size + (size % 2);
  }
  return null;
}

function edgeHeaders(env: Env, request: Request): Record<string, string> {
  return { authorization: `Bearer ${env.TRY_TOKEN}`, "x-voltip-client": clientAddress(request) || "none" };
}

/** What a failed edge answer means for the visitor. */
function edgeFailure(status: number, retryAfter: string | null): Response {
  if (status === 429) return fail(429, "busy", { retry_after: Number(retryAfter) || 30 });
  return fail(502, "service_failed", { status });
}

export async function transcribe(request: Request, env: Env, deps: Deps): Promise<Response> {
  if (!sameOrigin(request)) return fail(403, "cross_origin");
  if (!(await sessionValid(request, env, deps))) return fail(401, "no_session");
  const length = Number(request.headers.get("content-length") ?? "0");
  if (length > MAX_WAV_BYTES + 2048) return fail(413, "too_long", { max_seconds: MAX_SECONDS });
  const form = await request.formData().catch(() => null);
  const file = form?.get("file");
  if (!file || typeof file === "string") return fail(400, "no_audio");
  if (file.size > MAX_WAV_BYTES) return fail(413, "too_long", { max_seconds: MAX_SECONDS });
  const audio = new Uint8Array(await file.arrayBuffer());
  const seconds = wavSeconds(audio);
  if (seconds === null) return fail(415, "not_wav");
  if (seconds > MAX_SECONDS + 0.5) return fail(413, "too_long", { max_seconds: MAX_SECONDS });
  if (seconds < 0.3) return fail(400, "too_short");
  const language = String(form?.get("language") ?? "");
  if (language && language !== "auto" && !(LANGUAGES as readonly string[]).includes(language)) return fail(400, "bad_language");
  const refused = await admit(env, deps, request, "asr");
  if (refused) return refused;

  const upstream = new FormData();
  upstream.set("file", new Blob([audio], { type: "audio/wav" }), "take.wav");
  upstream.set("model", env.TRY_ASR_MODEL || DEFAULT_ASR_MODEL);
  upstream.set("response_format", "json");
  if (language && language !== "auto") upstream.set("language", language);
  const started = deps.now();
  let answer: Response;
  try {
    answer = await deps.fetch(`${env.EDGE_BASE}/try/v1/audio/transcriptions`, {
      method: "POST",
      headers: edgeHeaders(env, request),
      body: upstream,
      signal: AbortSignal.timeout(90_000),
    });
  } catch {
    return fail(502, "service_unreachable");
  }
  if (!answer.ok) return edgeFailure(answer.status, answer.headers.get("retry-after"));
  const result = (await answer.json().catch(() => null)) as { text?: unknown } | null;
  if (typeof result?.text !== "string") return fail(502, "service_failed");
  return json({ text: result.text.trim(), ms: deps.now() - started, seconds: Math.round(seconds * 10) / 10 });
}

interface PolishRequest {
  text?: unknown;
  model?: unknown;
  preset?: unknown;
  prompt?: unknown;
  language?: unknown;
}

export async function polish(request: Request, env: Env, deps: Deps): Promise<Response> {
  if (!sameOrigin(request)) return fail(403, "cross_origin");
  if (!(await sessionValid(request, env, deps))) return fail(401, "no_session");
  if (!(request.headers.get("content-type") ?? "").startsWith("application/json")) return fail(415, "not_json");
  const body = (await request.json().catch(() => null)) as PolishRequest | null;
  const text = typeof body?.text === "string" ? body.text.trim() : "";
  if (!text) return fail(400, "no_text");
  if ([...text].length > MAX_TEXT_CHARS) return fail(413, "text_too_long", { max_chars: MAX_TEXT_CHARS });
  const model = typeof body?.model === "string" && (POLISH_MODELS as readonly string[]).includes(body.model) ? body.model : null;
  if (!model) return fail(400, "bad_model");
  const language = typeof body?.language === "string" && (LANGUAGES as readonly string[]).includes(body.language) ? body.language : null;
  let base: string;
  let presetId: string | null = null;
  if (body?.preset === "custom") {
    const custom = typeof body.prompt === "string" ? body.prompt.trim() : "";
    if (!custom) return fail(400, "no_prompt");
    if ([...custom].length > MAX_PROMPT_CHARS) return fail(413, "prompt_too_long", { max_chars: MAX_PROMPT_CHARS });
    base = custom;
  } else {
    const preset = PRESETS.find((p) => p.id === body?.preset);
    if (!preset) return fail(400, "bad_preset");
    base = preset.prompt;
    presetId = preset.id;
  }
  const refused = await admit(env, deps, request, "polish");
  if (refused) return refused;

  const started = deps.now();
  let answer: Response;
  try {
    answer = await deps.fetch(`${env.EDGE_BASE}/try/refine/v1/chat/completions`, {
      method: "POST",
      headers: { ...edgeHeaders(env, request), "content-type": "application/json" },
      body: JSON.stringify({
        model,
        temperature: TEMPERATURE,
        max_tokens: outputBudget(presetId, [...text].length),
        messages: [
          { role: "system", content: systemPrompt(base, presetId, language) },
          { role: "user", content: text },
        ],
      }),
      signal: AbortSignal.timeout(60_000),
    });
  } catch {
    return fail(502, "service_unreachable");
  }
  if (!answer.ok) return edgeFailure(answer.status, answer.headers.get("retry-after"));
  const result = (await answer.json().catch(() => null)) as { model?: unknown; choices?: { message?: { content?: unknown } }[] } | null;
  const content = result?.choices?.[0]?.message?.content;
  if (typeof content !== "string" || !content.trim()) return fail(502, "service_failed");
  return json({ text: content.trim(), ms: deps.now() - started, model: typeof result?.model === "string" ? result.model : model });
}
