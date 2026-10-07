/** The last copy of a document another system sends now and then, kept in D1: the edge's statistics. */
import { ready } from "./counters";
import type { D1Like } from "./env";

export interface Snapshot {
  body: string;
  /** When it was stored (ms). */
  updatedAt: number;
}

export async function saveSnapshot(db: D1Like, name: string, body: string, now: number): Promise<void> {
  await (await ready(db))
    .prepare("INSERT INTO snapshots (name, body, updated_at) VALUES (?1, ?2, ?3) ON CONFLICT(name) DO UPDATE SET body = ?2, updated_at = ?3")
    .bind(name, body, now)
    .run();
}

export async function loadSnapshot(db: D1Like, name: string): Promise<Snapshot | null> {
  const row = await (await ready(db))
    .prepare("SELECT body, updated_at FROM snapshots WHERE name = ?1")
    .bind(name)
    .first<{ body: string; updated_at: number }>();
  return row ? { body: row.body, updatedAt: row.updated_at } : null;
}
