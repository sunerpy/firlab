/**
 * The admin page's API. A login needs the admin password and a Turnstile answer; five failed
 * logins from one address within 15 minutes lock it for 15 minutes from the fifth, and 30 failed
 * logins in an hour from all addresses together lock everyone out for the rest of that hour. A
 * login sets a 12-hour HttpOnly session cookie; the stats come from the edge's daily summaries,
 * which hold no address.
 *
 * The edge pushes those summaries every hour (POST /api/admin/edge-stats, after its cron job), and
 * the page reads the copy in D1: pulling them from here crosses from Cloudflare's overseas data
 * centres into mainland China on every page load, which took 2–6 s and now and then more than
 * 15 s (2026-10-07). A pull is only the fallback for a copy that is missing or over 90 minutes
 * old; when that fails too, the page shows the old copy and says so.
 */
import { addressHash, equalBytes, passwordMatches, sign, verify } from "./crypto";
import { type Window, bump, current, DAY, full, heldUntil, hold, HOUR, QUARTER_HOUR, secondsLeft, sweep } from "./counters";
import type { Deps, Env } from "./env";
import { clientAddress, cookie, fail, json, sameOrigin, setCookie } from "./http";
import { loadSnapshot, saveSnapshot } from "./snapshots";
import { LIMITS } from "./try";
import { humanVerified } from "./turnstile";

export const ADMIN_COOKIE = "vt_admin";
export const ADMIN_SECONDS = 12 * 3600;
export const FAILS_PER_ADDRESS = 5;
export const FAILS_PER_HOUR = 30;

interface Failures {
  address: Window;
  everyone: Window;
  /** The flag that locks the address. */
  lock: string;
}

async function failures(env: Env, request: Request): Promise<Failures> {
  const who = await addressHash(env.IP_SALT, clientAddress(request) || "none");
  return {
    address: { key: `admin:fail:addr:${who}`, ms: QUARTER_HOUR, limit: FAILS_PER_ADDRESS },
    everyone: { key: "admin:fail:all", ms: HOUR, limit: FAILS_PER_HOUR },
    lock: `admin:lock:addr:${who}`,
  };
}

/** Seconds the login stays locked for this address, or 0. */
async function lockedFor(env: Env, f: Failures, now: number): Promise<number> {
  const until = await heldUntil(env.DB, f.lock, now);
  if (until !== null) return Math.max(1, Math.ceil((until - now) / 1000));
  return (await full(env.DB, [f.everyone], now)) ? secondsLeft(f.everyone, now) : 0;
}

/** Counts a failed login; the fifth within the address's window locks it for QUARTER_HOUR. */
async function countFailure(env: Env, f: Failures, now: number): Promise<void> {
  await bump(env.DB, f.everyone, now);
  if ((await bump(env.DB, f.address, now)) >= FAILS_PER_ADDRESS) await hold(env.DB, f.lock, now + QUARTER_HOUR);
}

export async function login(request: Request, env: Env, deps: Deps): Promise<Response> {
  if (!sameOrigin(request)) return fail(403, "cross_origin");
  const now = deps.now();
  await sweep(env.DB, now);
  const f = await failures(env, request);
  const locked = await lockedFor(env, f, now);
  if (locked) return fail(429, "locked", { retry_after: locked });
  const body = (await request.json().catch(() => null)) as { password?: unknown; turnstile?: unknown } | null;
  if (!(await humanVerified(env, deps, body?.turnstile, clientAddress(request)))) return fail(403, "not_verified");
  const password = typeof body?.password === "string" ? body.password : "";
  const ok = password.length > 0 && password.length <= 256 && env.ADMIN_PASSWORD_HASH ? await passwordMatches(env.ADMIN_PASSWORD_HASH, password) : false;
  if (!ok) {
    await countFailure(env, f, now);
    return fail(401, "wrong_password");
  }
  const token = await sign(env.SESSION_KEY, "admin", { exp: now + ADMIN_SECONDS * 1000 });
  return json({ ok: true, expires_in: ADMIN_SECONDS }, 200, { "set-cookie": setCookie(request, ADMIN_COOKIE, token, "/api/admin", ADMIN_SECONDS) });
}

export function logout(request: Request): Response {
  if (!sameOrigin(request)) return fail(403, "cross_origin");
  return json({ ok: true }, 200, { "set-cookie": setCookie(request, ADMIN_COOKIE, "", "/api/admin", 0) });
}

export async function signedIn(request: Request, env: Env, deps: Deps): Promise<boolean> {
  const payload = await verify(env.SESSION_KEY, "admin", cookie(request, ADMIN_COOKIE));
  return typeof payload?.exp === "number" && payload.exp > deps.now();
}

export const EDGE_SNAPSHOT = "edge-stats";
/** The edge pushes every hour; a copy older than this is pulled again. */
export const EDGE_FRESH_MS = 90 * 60 * 1000;
export const MAX_EDGE_BYTES = 512 * 1024;

function isSummary(value: unknown): boolean {
  return typeof value === "object" && value !== null && Array.isArray((value as { days?: unknown }).days);
}

/** The edge's push: its token, and recent.json as it wrote it. */
export async function receiveEdgeStats(request: Request, env: Env, deps: Deps): Promise<Response> {
  const given = new TextEncoder().encode(request.headers.get("authorization") ?? "");
  if (!env.STATS_TOKEN || !equalBytes(given, new TextEncoder().encode(`Bearer ${env.STATS_TOKEN}`))) return fail(401, "unauthorized");
  const text = await request.text();
  if (text.length > MAX_EDGE_BYTES) return fail(413, "too_large");
  let body: unknown;
  try {
    body = JSON.parse(text);
  } catch {
    return fail(400, "not_json");
  }
  if (!isSummary(body)) return fail(400, "not_stats");
  await saveSnapshot(env.DB, EDGE_SNAPSHOT, text, deps.now());
  return new Response(null, { status: 204 });
}

async function pullEdgeStats(env: Env, deps: Deps): Promise<{ text: string } | { error: string }> {
  try {
    const answer = await deps.fetch(`${env.EDGE_BASE}/stats/recent.json`, {
      headers: { authorization: `Bearer ${env.STATS_TOKEN}` },
      signal: AbortSignal.timeout(20_000),
    });
    if (!answer.ok) return { error: `edge answered ${answer.status}` };
    const text = await answer.text();
    return isSummary(JSON.parse(text)) ? { text } : { error: "edge sent no statistics" };
  } catch (error) {
    return { error: error instanceof Error && error.name === "TimeoutError" ? "edge timed out" : "edge unreachable" };
  }
}

export async function stats(request: Request, env: Env, deps: Deps): Promise<Response> {
  if (!(await signedIn(request, env, deps))) return fail(401, "signed_out");
  const now = deps.now();
  let kept = await loadSnapshot(env.DB, EDGE_SNAPSHOT);
  let edgeError: string | null = null;
  if (!kept || now - kept.updatedAt > EDGE_FRESH_MS) {
    const pulled = await pullEdgeStats(env, deps);
    if ("text" in pulled) {
      await saveSnapshot(env.DB, EDGE_SNAPSHOT, pulled.text, now);
      kept = { body: pulled.text, updatedAt: now };
    } else {
      edgeError = pulled.error;
    }
  }
  const today = async (kind: string) => current(env.DB, { key: `try:${kind}:all`, ms: DAY, limit: 0 }, now);
  return json({
    edge: kept ? (JSON.parse(kept.body) as unknown) : null,
    edge_received_at: kept?.updatedAt ?? null,
    edge_error: edgeError,
    try_today: { asr: await today("asr"), polish: await today("polish"), limits: LIMITS },
  });
}
