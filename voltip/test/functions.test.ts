import { describe, expect, it } from "vitest";

import { ADMIN_COOKIE, FAILS_PER_ADDRESS, FAILS_PER_HOUR, login, logout, stats } from "../functions/_lib/admin";
import { bump, DAY } from "../functions/_lib/counters";
import { hashPassword, passwordMatches, sign, verify } from "../functions/_lib/crypto";
import type { D1Like, D1Statement, Deps, Env } from "../functions/_lib/env";
import { setCookie } from "../functions/_lib/http";
import { outputBudget, systemPrompt } from "../functions/_lib/presets";
import { LIMITS, MAX_SECONDS, options, polish, SESSION_COOKIE, startSession, transcribe, wavSeconds } from "../functions/_lib/try";
import { SITEVERIFY } from "../functions/_lib/turnstile";

const SITE = "https://voltip.firlab.app";
const EDGE = "https://edge.example.test";
const NOW = 1_790_000_000_000;
const PASSWORD = "correct horse battery staple 42";

/** The statements the counters use, over a Map. */
function memoryD1(): D1Like & { rows: Map<string, { n: number; expires_at: number }> } {
  const rows = new Map<string, { n: number; expires_at: number }>();
  const statement = (sql: string, values: unknown[] = []): D1Statement => ({
    bind: (...v: unknown[]) => statement(sql, v),
    async first<T>() {
      const key = String(values[0]);
      if (sql.startsWith("SELECT n FROM counters")) return (rows.has(key) ? { n: rows.get(key)!.n } : null) as T | null;
      if (sql.startsWith("SELECT expires_at FROM counters")) {
        const row = rows.get(key);
        return (row && row.expires_at > Number(values[1]) ? { expires_at: row.expires_at } : null) as T | null;
      }
      if (sql.startsWith("INSERT INTO counters")) {
        const row = rows.get(key) ?? { n: 0, expires_at: Number(values[1]) };
        row.n += 1;
        rows.set(key, row);
        return { n: row.n } as T;
      }
      throw new Error(`unexpected query ${sql}`);
    },
    async run() {
      if (sql.startsWith("CREATE ")) return {};
      if (sql.startsWith("INSERT INTO counters") && sql.includes("SET expires_at")) {
        rows.set(String(values[0]), { n: 1, expires_at: Number(values[1]) });
        return {};
      }
      if (!sql.startsWith("DELETE FROM counters")) throw new Error(`unexpected statement ${sql}`);
      for (const [key, row] of rows) if (row.expires_at < Number(values[0])) rows.delete(key);
      return {};
    },
  });
  return { rows, prepare: (sql: string) => statement(sql) };
}

interface Call {
  url: string;
  init: RequestInit;
}

async function setup(edge: (url: string, init: RequestInit) => Response = () => Response.json({ text: "你好" })) {
  const calls: Call[] = [];
  let now = NOW;
  const deps: Deps = {
    now: () => now,
    fetch: (async (input: RequestInfo | URL, init: RequestInit = {}) => {
      const url = String(input);
      calls.push({ url, init });
      if (url === SITEVERIFY) {
        const form = init.body as FormData;
        return Response.json({ success: form.get("response") === "human", hostname: "voltip.firlab.app" });
      }
      return edge(url, init);
    }) as typeof fetch,
  };
  const env: Env = {
    DB: memoryD1(),
    EDGE_BASE: EDGE,
    TRY_TOKEN: "try-token",
    STATS_TOKEN: "stats-token",
    TURNSTILE_SITE_KEY: "site-key",
    TURNSTILE_SECRET: "turnstile-secret",
    ADMIN_PASSWORD_HASH: await hashPassword(PASSWORD, new Uint8Array(16).fill(7), 1000),
    SESSION_KEY: "k".repeat(40),
    IP_SALT: "salt",
  };
  return { env, deps, calls, advance: (ms: number) => (now += ms) };
}

function post(path: string, body: BodyInit, headers: Record<string, string> = {}): Request {
  return new Request(`${SITE}${path}`, {
    method: "POST",
    headers: { origin: SITE, "cf-connecting-ip": "203.0.113.7", ...headers },
    body,
  });
}

function wav(seconds: number, rate = 16_000, channels = 1): Uint8Array<ArrayBuffer> {
  const samples = Math.round(seconds * rate) * channels;
  const bytes = new Uint8Array(44 + samples * 2);
  const view = new DataView(bytes.buffer);
  const tag = (at: number, text: string) => [...text].forEach((c, i) => (bytes[at + i] = c.charCodeAt(0)));
  tag(0, "RIFF");
  view.setUint32(4, 36 + samples * 2, true);
  tag(8, "WAVE");
  tag(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, channels, true);
  view.setUint32(24, rate, true);
  view.setUint32(28, rate * channels * 2, true);
  view.setUint16(32, channels * 2, true);
  view.setUint16(34, 16, true);
  tag(36, "data");
  view.setUint32(40, samples * 2, true);
  return bytes;
}

async function session(env: Env, deps: Deps): Promise<string> {
  const answer = await startSession(post("/api/try/session", JSON.stringify({ turnstile: "human" }), { "content-type": "application/json" }), env, deps);
  expect(answer.status).toBe(200);
  const cookie = answer.headers.get("set-cookie")!;
  expect(cookie).toMatch(/HttpOnly; Secure; SameSite=Strict/);
  expect(cookie).toContain("Path=/api/try");
  return cookie.split(";")[0]!;
}

function audioForm(bytes: Uint8Array<ArrayBuffer>, language = "zh"): FormData {
  const form = new FormData();
  form.set("file", new Blob([bytes], { type: "audio/wav" }), "take.wav");
  form.set("language", language);
  return form;
}

describe("try page", () => {
  it("lists what the page may choose and the limits", async () => {
    const { env } = await setup();
    const body = (await options(env).json()) as Record<string, unknown>;
    expect(body.polish_models).toEqual(["qwen/qwen3.8-27b", "openai/gpt-oss-120b", "openai/gpt-oss-20b"]);
    expect(body.presets).toContain("proofread");
    expect(body.max_seconds).toBe(MAX_SECONDS);
    expect(body.turnstile_site_key).toBe("site-key");
    expect(JSON.stringify(body)).not.toContain("try-token");
  });

  it("starts a session only for a verified visitor from this site", async () => {
    const { env, deps } = await setup();
    const robot = await startSession(post("/api/try/session", JSON.stringify({ turnstile: "robot" })), env, deps);
    expect(robot.status).toBe(403);
    const foreign = await startSession(post("/api/try/session", JSON.stringify({ turnstile: "human" }), { origin: "https://evil.example" }), env, deps);
    expect(foreign.status).toBe(403);
    expect(await session(env, deps)).toMatch(new RegExp(`^${SESSION_COOKIE}=`));
  });

  it("refuses recognition without a live session", async () => {
    const { env, deps, advance } = await setup();
    expect((await transcribe(post("/api/try/transcribe", audioForm(wav(2))), env, deps)).status).toBe(401);
    const cookie = await session(env, deps);
    advance(31 * 60 * 1000);
    expect((await transcribe(post("/api/try/transcribe", audioForm(wav(2)), { cookie }), env, deps)).status).toBe(401);
  });

  it("forwards a recording with the try token and the visitor's address", async () => {
    const { env, deps, calls } = await setup();
    const cookie = await session(env, deps);
    const answer = await transcribe(post("/api/try/transcribe", audioForm(wav(3)), { cookie }), env, deps);
    expect(answer.status).toBe(200);
    expect(await answer.json()).toMatchObject({ text: "你好", seconds: 3 });
    const edge = calls.find((c) => c.url.startsWith(EDGE))!;
    expect(edge.url).toBe(`${EDGE}/try/v1/audio/transcriptions`);
    const headers = edge.init.headers as Record<string, string>;
    expect(headers.authorization).toBe("Bearer try-token");
    expect(headers["x-voltip-client"]).toBe("203.0.113.7");
    const form = edge.init.body as FormData;
    expect(form.get("model")).toBe("Qwen/Qwen3-ASR-1.7B");
    expect(form.get("language")).toBe("zh");
  });

  it("refuses what is not a 16 kHz mono WAV of at most a minute", async () => {
    const { env, deps } = await setup();
    const cookie = await session(env, deps);
    const status = async (bytes: Uint8Array<ArrayBuffer>) => (await transcribe(post("/api/try/transcribe", audioForm(bytes), { cookie }), env, deps)).status;
    expect(await status(new Uint8Array(new TextEncoder().encode("not a wav file at all, just some text")))).toBe(415);
    expect(await status(wav(2, 44_100))).toBe(415);
    expect(await status(wav(2, 16_000, 2))).toBe(415);
    expect(await status(wav(MAX_SECONDS + 2))).toBe(413);
    expect(await status(wav(0.1))).toBe(400);
    const bad = await transcribe(post("/api/try/transcribe", audioForm(wav(2), "fr"), { cookie }), env, deps);
    expect(bad.status).toBe(400);
  });

  it("stops a visitor after the hourly limit and everyone after the daily one", async () => {
    const { env, deps } = await setup();
    const cookie = await session(env, deps);
    for (let i = 0; i < LIMITS.asrPerHour; i++) {
      expect((await transcribe(post("/api/try/transcribe", audioForm(wav(1)), { cookie }), env, deps)).status).toBe(200);
    }
    const hourly = await transcribe(post("/api/try/transcribe", audioForm(wav(1)), { cookie }), env, deps);
    expect(hourly.status).toBe(429);
    expect(await hourly.json()).toMatchObject({ error: "hourly_limit" });
    expect(Number(hourly.headers.get("retry-after"))).toBeGreaterThan(0);
    // Another visitor, the same day: only the daily total is left in the way.
    for (let i = 0; i < LIMITS.asrPerDay; i++) await bump(env.DB, { key: "try:asr:all", ms: DAY, limit: 0 }, deps.now());
    const daily = await transcribe(post("/api/try/transcribe", audioForm(wav(1)), { cookie, "cf-connecting-ip": "198.51.100.9" }), env, deps);
    expect(daily.status).toBe(429);
    expect(await daily.json()).toMatchObject({ error: "daily_limit" });
  });

  it("keeps no address, and drops a visitor's counts with the next request after their hour", async () => {
    const { env, deps, advance } = await setup();
    const rows = (env.DB as ReturnType<typeof memoryD1>).rows;
    const visitors = () => [...rows.keys()].filter((key) => key.includes(":addr:"));
    let cookie = await session(env, deps);
    expect((await transcribe(post("/api/try/transcribe", audioForm(wav(1)), { cookie }), env, deps)).status).toBe(200);
    const first = visitors();
    expect(first).toHaveLength(1);
    expect([...rows.keys()].join(" ")).not.toContain("203.0.113.7");
    advance(60 * 60 * 1000);
    cookie = await session(env, deps);
    expect((await transcribe(post("/api/try/transcribe", audioForm(wav(1)), { cookie, "cf-connecting-ip": "198.51.100.9" }), env, deps)).status).toBe(200);
    expect(visitors()).toHaveLength(1);
    expect(visitors()).not.toContain(first[0]);
  });

  it("passes the edge's own 429 on as busy", async () => {
    const { env, deps } = await setup(() => new Response("{}", { status: 429, headers: { "retry-after": "17" } }));
    const cookie = await session(env, deps);
    const answer = await transcribe(post("/api/try/transcribe", audioForm(wav(1)), { cookie }), env, deps);
    expect(answer.status).toBe(429);
    expect(await answer.json()).toMatchObject({ error: "busy", retry_after: 17 });
  });

  it("polishes with a preset the way the app does, or with the visitor's prompt", async () => {
    const { env, deps, calls } = await setup(() => Response.json({ model: "qwen/qwen3.8-27b", choices: [{ message: { content: " 你好。 " } }] }));
    const cookie = await session(env, deps);
    const send = (body: unknown) => polish(post("/api/try/polish", JSON.stringify(body), { cookie, "content-type": "application/json" }), env, deps);
    const answer = await send({ text: "你好", model: "qwen/qwen3.8-27b", preset: "proofread", language: "zh" });
    expect(answer.status).toBe(200);
    expect(await answer.json()).toMatchObject({ text: "你好。", model: "qwen/qwen3.8-27b" });
    const request = JSON.parse(String(calls.at(-1)!.init.body)) as { messages: { role: string; content: string }[]; temperature: number; max_tokens: number };
    expect(calls.at(-1)!.url).toBe(`${EDGE}/try/refine/v1/chat/completions`);
    expect(request.messages[0]!.content).toMatch(/^你是语音听写的校对/);
    expect(request.messages[0]!.content).toMatch(/说话人使用的语言代码：zh。输出保持这种语言。$/);
    expect(request.messages[1]).toEqual({ role: "user", content: "你好" });
    expect(request.temperature).toBe(0.2);
    expect(request.max_tokens).toBe(128);

    expect((await send({ text: "hi", model: "custom-model", preset: "proofread" })).status).toBe(400);
    expect((await send({ text: "hi", model: "openai/gpt-oss-20b", preset: "nope" })).status).toBe(400);
    expect((await send({ text: "hi", model: "openai/gpt-oss-20b", preset: "custom", prompt: "x".repeat(2001) })).status).toBe(413);
    expect((await send({ text: "hi", model: "openai/gpt-oss-20b", preset: "custom", prompt: "Answer in one word." })).status).toBe(200);
    expect(JSON.parse(String(calls.at(-1)!.init.body)).messages[0].content).toBe("Answer in one word.");
  });

  it("stops a visitor's polish after ten an hour", async () => {
    const { env, deps } = await setup(() => Response.json({ choices: [{ message: { content: "ok" } }] }));
    const cookie = await session(env, deps);
    const send = () => polish(post("/api/try/polish", JSON.stringify({ text: "hi", model: "openai/gpt-oss-20b", preset: "formal" }), { cookie, "content-type": "application/json" }), env, deps);
    for (let i = 0; i < LIMITS.polishPerHour; i++) expect((await send()).status).toBe(200);
    expect((await send()).status).toBe(429);
  });
});

describe("admin page", () => {
  const send = (env: Env, deps: Deps, password: string, extra: Record<string, string> = {}) =>
    login(post("/api/admin/login", JSON.stringify({ password, turnstile: "human" }), { "content-type": "application/json", ...extra }), env, deps);

  it("signs in with the password and reads the edge's stats with its own token", async () => {
    const { env, deps, calls } = await setup((url) => (url.endsWith("/stats/recent.json") ? Response.json({ days: [{ day: "2026-10-07", users: 3 }] }) : new Response("", { status: 404 })));
    const signed = await send(env, deps, PASSWORD);
    expect(signed.status).toBe(200);
    const cookie = signed.headers.get("set-cookie")!;
    expect(cookie).toContain("Path=/api/admin");
    expect(cookie).toMatch(/HttpOnly; Secure; SameSite=Strict/);
    const answer = await stats(new Request(`${SITE}/api/admin/stats`, { headers: { cookie: cookie.split(";")[0]! } }), env, deps);
    expect(answer.status).toBe(200);
    expect(await answer.json()).toMatchObject({ edge: { days: [{ users: 3 }] }, try_today: { asr: 0, polish: 0 } });
    const edge = calls.find((c) => c.url.endsWith("/stats/recent.json"))!;
    expect((edge.init.headers as Record<string, string>).authorization).toBe("Bearer stats-token");
  });

  it("refuses the stats without a session and after logging out", async () => {
    const { env, deps } = await setup();
    expect((await stats(new Request(`${SITE}/api/admin/stats`), env, deps)).status).toBe(401);
    const forged = `${ADMIN_COOKIE}=${await sign("another key that is long enough", "admin", { exp: NOW + 1e9 })}`;
    expect((await stats(new Request(`${SITE}/api/admin/stats`, { headers: { cookie: forged } }), env, deps)).status).toBe(401);
    const out = logout(post("/api/admin/logout", ""));
    expect(out.headers.get("set-cookie")).toMatch(new RegExp(`^${ADMIN_COOKIE}=; Path=/api/admin; Max-Age=0`));
  });

  it("locks an address for 15 minutes from its fifth wrong password, even for the right one", async () => {
    const { env, deps, advance } = await setup();
    for (let i = 0; i < FAILS_PER_ADDRESS; i++) expect((await send(env, deps, `wrong ${i}`)).status).toBe(401);
    const locked = await send(env, deps, PASSWORD);
    expect(locked.status).toBe(429);
    expect(await locked.json()).toMatchObject({ error: "locked", retry_after: 15 * 60 });
    // Another address is not locked.
    expect((await send(env, deps, PASSWORD, { "cf-connecting-ip": "198.51.100.20" })).status).toBe(200);
    // The counting window ends 100 s after NOW; the lock still holds after it.
    advance(14 * 60 * 1000);
    expect((await send(env, deps, PASSWORD)).status).toBe(429);
    advance(60 * 1000);
    expect((await send(env, deps, PASSWORD)).status).toBe(200);
  });

  it("locks everyone out after 30 failures in an hour", async () => {
    const { env, deps } = await setup();
    for (let i = 0; i < FAILS_PER_HOUR; i++) {
      expect((await send(env, deps, `wrong ${i}`, { "cf-connecting-ip": `198.51.100.${i}` })).status).toBe(401);
    }
    const locked = await send(env, deps, PASSWORD, { "cf-connecting-ip": "203.0.113.200" });
    expect(locked.status).toBe(429);
    expect(await locked.json()).toMatchObject({ error: "locked" });
  });

  it("needs Turnstile and this site's origin", async () => {
    const { env, deps } = await setup();
    const robot = await login(post("/api/admin/login", JSON.stringify({ password: PASSWORD, turnstile: "robot" })), env, deps);
    expect(robot.status).toBe(403);
    expect((await send(env, deps, PASSWORD, { origin: "https://evil.example" })).status).toBe(403);
  });
});

describe("pieces", () => {
  it("rejects a tampered token and an expired format", async () => {
    const token = await sign("k".repeat(40), "try", { exp: 5 });
    expect(await verify("k".repeat(40), "try", token)).toEqual({ exp: 5 });
    expect(await verify("k".repeat(40), "admin", token)).toBeNull();
    expect(await verify("k".repeat(40), "try", `${token}x`)).toBeNull();
    expect(await verify("k".repeat(40), "try", "a.b.c")).toBeNull();
  });

  it("checks the password hash and refuses a malformed one", async () => {
    const stored = await hashPassword(PASSWORD, new Uint8Array(16).fill(1), 1000);
    expect(await passwordMatches(stored, PASSWORD)).toBe(true);
    expect(await passwordMatches(stored, `${PASSWORD}!`)).toBe(false);
    expect(await passwordMatches("plain", PASSWORD)).toBe(false);
    expect(await passwordMatches(stored.replace("$1000$", "$10$"), PASSWORD)).toBe(false);
  });

  it("leaves Secure off a cookie only for plain http on this machine or the local network", () => {
    const at = (url: string) => setCookie(new Request(url), "c", "v", "/", 60);
    expect(at("https://voltip.firlab.app/api/try/session")).toContain("HttpOnly; Secure; SameSite=Strict");
    expect(at("http://voltip.firlab.app/api/try/session")).toContain("HttpOnly; Secure; SameSite=Strict");
    expect(at("http://192.168.1.20:8788/api/try/session")).toBe("c=v; Path=/; Max-Age=60; HttpOnly; SameSite=Strict");
    expect(at("http://localhost:8788/api/try/session")).not.toContain("Secure");
  });

  it("reads a WAV's length and builds the app's prompt", () => {
    expect(wavSeconds(wav(2.5))).toBeCloseTo(2.5, 3);
    expect(systemPrompt("P", "translate", "en")).toBe("P\n\n说话人使用的语言代码：en。");
    expect(systemPrompt("P", null, null)).toBe("P");
    expect(outputBudget("prompt", 100)).toBe(428);
    expect(outputBudget("notes", 10)).toBe(128);
    expect(outputBudget("formal", 5000)).toBe(900);
  });
});
