/**
 * Bindings of the voltip-docs Pages project (set in the dashboard or with the API, never in the
 * repository). The try page and the admin page share one D1 database for their counters.
 */

/** The part of D1 the Functions use, so tests can pass a small in-memory database. */
export interface D1Statement {
  bind(...values: unknown[]): D1Statement;
  first<T = Record<string, unknown>>(): Promise<T | null>;
  run(): Promise<unknown>;
}

export interface D1Like {
  prepare(query: string): D1Statement;
}

export interface Env {
  /** Counters: per-address hourly limits, daily totals, failed logins. */
  DB: D1Like;
  /** The built-in service's edge, e.g. https://edge.example (no trailing slash). */
  EDGE_BASE: string;
  /** Bearer the edge accepts on /try/ only. */
  TRY_TOKEN: string;
  /** Bearer the edge accepts on /stats/ only. */
  STATS_TOKEN: string;
  /** Turnstile widget of the site; the site key is public, the secret is not. */
  TURNSTILE_SITE_KEY: string;
  TURNSTILE_SECRET: string;
  /** `pbkdf2-sha256$<iterations>$<salt, base64url>$<hash, base64url>`. */
  ADMIN_PASSWORD_HASH: string;
  /** HMAC key of the session cookies (hex or any string of 32+ characters). */
  SESSION_KEY: string;
  /** HMAC key for the addresses in the counters: D1 never sees an address. */
  IP_SALT: string;
  /** The recognition model the edge serves (the app's built-in one). */
  TRY_ASR_MODEL?: string;
  /** Hosts the Turnstile answer may come from; default voltip.firlab.app. */
  TURNSTILE_HOSTNAMES?: string;
}

/** What a handler needs besides the environment, injectable in tests. */
export interface Deps {
  now: () => number;
  fetch: typeof fetch;
}

export const defaultDeps: Deps = { now: () => Date.now(), fetch: (input, init) => fetch(input, init) };
