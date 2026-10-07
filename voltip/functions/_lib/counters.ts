/**
 * Fixed-window counters in D1: one row per key and window, dropped once the window has passed.
 * A request is checked before it is counted, so a refused one does not use up the next window.
 * Keys carry an HMAC of the address (IP_SALT), never the address itself.
 */
import type { D1Like } from "./env";

/** The whole schema; each isolate creates it before its first query, so a new database needs no setup. */
export const SCHEMA = [
  "CREATE TABLE IF NOT EXISTS counters (key TEXT PRIMARY KEY, n INTEGER NOT NULL, expires_at INTEGER NOT NULL)",
  "CREATE INDEX IF NOT EXISTS counters_expires_at ON counters (expires_at)",
];

let created: Promise<void> | null = null;

async function ready(db: D1Like): Promise<D1Like> {
  created ??= (async () => {
    for (const sql of SCHEMA) await db.prepare(sql).run();
  })().catch((error: unknown) => {
    created = null;
    throw error;
  });
  await created;
  return db;
}

export interface Window {
  /** Counter name without the window, e.g. `try:asr:addr:<hash>`. */
  key: string;
  /** Length of the window in milliseconds. */
  ms: number;
  limit: number;
}

function windowKey(w: Window, now: number): { key: string; start: number; end: number } {
  const start = Math.floor(now / w.ms) * w.ms;
  return { key: `${w.key}:${start}`, start, end: start + w.ms };
}

export async function current(db: D1Like, w: Window, now: number): Promise<number> {
  const { key } = windowKey(w, now);
  const row = await (await ready(db)).prepare("SELECT n FROM counters WHERE key = ?1").bind(key).first<{ n: number }>();
  return row?.n ?? 0;
}

/** Seconds until the window of `w` that holds `now` ends. */
export function secondsLeft(w: Window, now: number): number {
  return Math.max(1, Math.ceil((windowKey(w, now).end - now) / 1000));
}

export async function bump(db: D1Like, w: Window, now: number): Promise<number> {
  const { key, end } = windowKey(w, now);
  const row = await (await ready(db))
    .prepare("INSERT INTO counters (key, n, expires_at) VALUES (?1, 1, ?2) ON CONFLICT(key) DO UPDATE SET n = n + 1 RETURNING n")
    .bind(key, end)
    .first<{ n: number }>();
  return row?.n ?? 1;
}

/** The first window of `windows` that is full, or null. */
export async function full(db: D1Like, windows: Window[], now: number): Promise<Window | null> {
  for (const w of windows) {
    if ((await current(db, w, now)) >= w.limit) return w;
  }
  return null;
}

export async function bumpAll(db: D1Like, windows: Window[], now: number): Promise<void> {
  for (const w of windows) await bump(db, w, now);
}

/** Sets flag `key` until `until` (ms), e.g. an address locked after too many failed logins. */
export async function hold(db: D1Like, key: string, until: number): Promise<void> {
  await (await ready(db))
    .prepare("INSERT INTO counters (key, n, expires_at) VALUES (?1, 1, ?2) ON CONFLICT(key) DO UPDATE SET expires_at = ?2")
    .bind(key, until)
    .run();
}

/** When flag `key` lapses (ms), or null when it is not set at `now`. */
export async function heldUntil(db: D1Like, key: string, now: number): Promise<number | null> {
  const row = await (await ready(db))
    .prepare("SELECT expires_at FROM counters WHERE key = ?1 AND expires_at > ?2")
    .bind(key, now)
    .first<{ expires_at: number }>();
  return row?.expires_at ?? null;
}

/** Drops the rows of windows that have passed; every counted request runs it. */
export async function sweep(db: D1Like, now: number): Promise<void> {
  await (await ready(db)).prepare("DELETE FROM counters WHERE expires_at < ?1").bind(now).run();
}

export const HOUR = 3_600_000;
export const DAY = 86_400_000;
export const QUARTER_HOUR = 900_000;
