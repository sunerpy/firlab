/** HMAC-signed tokens, the address hash and the admin password check (WebCrypto only). */

const encoder = new TextEncoder();

export function base64url(bytes: ArrayBuffer | Uint8Array): string {
  const view = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let text = "";
  for (const byte of view) text += String.fromCharCode(byte);
  return btoa(text).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function fromBase64url(text: string): Uint8Array<ArrayBuffer> {
  const padded = text.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((text.length + 3) % 4);
  const raw = atob(padded);
  const bytes = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) bytes[i] = raw.charCodeAt(i);
  return bytes;
}

/** Compares in time independent of where the inputs differ. */
export function equalBytes(a: Uint8Array, b: Uint8Array): boolean {
  let diff = a.length ^ b.length;
  for (let i = 0; i < Math.max(a.length, b.length); i++) diff |= (a[i] ?? 0) ^ (b[i] ?? 0);
  return diff === 0;
}

async function hmacKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
}

export async function hmac(secret: string, message: string): Promise<Uint8Array> {
  return new Uint8Array(await crypto.subtle.sign("HMAC", await hmacKey(secret), encoder.encode(message)));
}

/** The address as the counters store it: keyed, so a leaked table names nobody. */
export async function addressHash(salt: string, address: string): Promise<string> {
  return base64url((await hmac(salt, `address:${address}`)).slice(0, 16));
}

/** `<payload>.<signature>` for a JSON payload; `purpose` keeps the try and admin tokens apart. */
export async function sign(secret: string, purpose: string, payload: Record<string, unknown>): Promise<string> {
  const body = base64url(encoder.encode(JSON.stringify(payload)));
  return `${body}.${base64url(await hmac(secret, `${purpose}.${body}`))}`;
}

/** The payload of a token `sign` made for `purpose`, or null when it is forged or malformed. */
export async function verify(secret: string, purpose: string, token: string | null): Promise<Record<string, unknown> | null> {
  if (!token) return null;
  const [body, signature, extra] = token.split(".");
  if (!body || !signature || extra !== undefined) return null;
  let given: Uint8Array;
  try {
    given = fromBase64url(signature);
  } catch {
    return null;
  }
  if (!equalBytes(given, await hmac(secret, `${purpose}.${body}`))) return null;
  try {
    const payload: unknown = JSON.parse(new TextDecoder().decode(fromBase64url(body)));
    return payload && typeof payload === "object" ? (payload as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

/**
 * Checks `password` against `pbkdf2-sha256$<iterations>$<salt>$<hash>`. A stored value that does
 * not parse never matches. The password itself is long and random, so a moderate iteration count
 * keeps the check inside a Function's CPU time without weakening it.
 */
export async function passwordMatches(stored: string, password: string): Promise<boolean> {
  const [scheme, rounds, salt, hash, extra] = stored.split("$");
  const iterations = Number(rounds);
  if (scheme !== "pbkdf2-sha256" || !salt || !hash || extra !== undefined || !Number.isInteger(iterations) || iterations < 1000 || iterations > 100_000) {
    return false;
  }
  const key = await crypto.subtle.importKey("raw", encoder.encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt: fromBase64url(salt), iterations }, key, 256);
  return equalBytes(new Uint8Array(bits), fromBase64url(hash));
}

/** The stored form of `password`, for setting ADMIN_PASSWORD_HASH (scripts/admin-password.mjs). */
export async function hashPassword(password: string, salt: Uint8Array<ArrayBuffer>, iterations: number): Promise<string> {
  const key = await crypto.subtle.importKey("raw", encoder.encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt, iterations }, key, 256);
  return `pbkdf2-sha256$${iterations}$${base64url(salt)}$${base64url(bits)}`;
}
