/** JSON responses, the visitor's address and the same-origin check of the API. */

const NO_STORE = {
  "cache-control": "no-store",
  "x-content-type-options": "nosniff",
  "referrer-policy": "no-referrer",
};

export function json(body: unknown, status = 200, headers: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", ...NO_STORE, ...headers },
  });
}

/** An error the page shows: a stable `error` code, and `retry_after` seconds when it applies. */
export function fail(status: number, error: string, extra: Record<string, unknown> = {}, headers: Record<string, string> = {}): Response {
  const retry: Record<string, string> = typeof extra.retry_after === "number" ? { "retry-after": String(Math.max(1, Math.ceil(extra.retry_after))) } : {};
  return json({ error, ...extra }, status, { ...retry, ...headers });
}

/** The visitor's address as Cloudflare saw it. */
export function clientAddress(request: Request): string {
  return request.headers.get("cf-connecting-ip") ?? "";
}

/**
 * A request that changes state must come from a page of this site: browsers send `Origin` with
 * every POST, so a missing one is refused as well. Cookies are SameSite=Strict besides.
 */
export function sameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  try {
    return new URL(origin).host === new URL(request.url).host;
  } catch {
    return false;
  }
}

/** The value of cookie `name`, or null. */
export function cookie(request: Request, name: string): string | null {
  const header = request.headers.get("cookie") ?? "";
  for (const part of header.split(";")) {
    const [key, ...rest] = part.trim().split("=");
    if (key === name) return rest.join("=") || null;
  }
  return null;
}

/**
 * Plain http from this machine or the local network, as `wrangler pages dev` serves the site to a
 * phone or another computer; a browser drops a Secure cookie there. Anything else is Secure.
 */
function localHttp(request: Request): boolean {
  const url = new URL(request.url);
  return url.protocol === "http:" && /^(localhost|127\.\d+\.\d+\.\d+|\[::1\]|10\.\d+\.\d+\.\d+|192\.168\.\d+\.\d+)$/.test(url.hostname);
}

export function setCookie(request: Request, name: string, value: string, path: string, maxAgeSeconds: number): string {
  return `${name}=${value}; Path=${path}; Max-Age=${maxAgeSeconds}; HttpOnly;${localHttp(request) ? "" : " Secure;"} SameSite=Strict`;
}
