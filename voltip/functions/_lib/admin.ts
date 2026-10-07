/**
 * The admin page's API. A login needs the admin password and a Turnstile answer; five failed
 * logins from one address within 15 minutes lock it for 15 minutes from the fifth, and 30 failed
 * logins in an hour from all addresses together lock everyone out for the rest of that hour. A
 * login sets a 12-hour HttpOnly session cookie; the stats come from the edge's daily summaries,
 * which hold no address.
 */
import { addressHash, passwordMatches, sign, verify } from "./crypto";
import { type Window, bump, current, DAY, full, heldUntil, hold, HOUR, QUARTER_HOUR, secondsLeft, sweep } from "./counters";
import type { Deps, Env } from "./env";
import { clientAddress, cookie, fail, json, sameOrigin, setCookie } from "./http";
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

export async function stats(request: Request, env: Env, deps: Deps): Promise<Response> {
  if (!(await signedIn(request, env, deps))) return fail(401, "signed_out");
  let edge: unknown = null;
  let edgeError: string | null = null;
  try {
    const answer = await deps.fetch(`${env.EDGE_BASE}/stats/recent.json`, {
      headers: { authorization: `Bearer ${env.STATS_TOKEN}` },
      signal: AbortSignal.timeout(15_000),
    });
    if (answer.ok) edge = await answer.json();
    else edgeError = `edge answered ${answer.status}`;
  } catch {
    edgeError = "edge unreachable";
  }
  const now = deps.now();
  const today = async (kind: string) => current(env.DB, { key: `try:${kind}:all`, ms: DAY, limit: 0 }, now);
  return json({
    edge,
    edge_error: edgeError,
    try_today: { asr: await today("asr"), polish: await today("polish"), limits: LIMITS },
  });
}
