/** Cloudflare Turnstile: the answer the widget gave the page, checked once on the server. */
import type { Deps, Env } from "./env";

export const SITEVERIFY = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export async function humanVerified(env: Env, deps: Deps, response: unknown, address: string): Promise<boolean> {
  if (typeof response !== "string" || response.length === 0 || response.length > 2048 || !env.TURNSTILE_SECRET) return false;
  const form = new FormData();
  form.set("secret", env.TURNSTILE_SECRET);
  form.set("response", response);
  if (address) form.set("remoteip", address);
  let result: { success?: boolean; hostname?: string };
  try {
    const answer = await deps.fetch(SITEVERIFY, { method: "POST", body: form, signal: AbortSignal.timeout(10_000) });
    result = (await answer.json()) as typeof result;
  } catch {
    return false;
  }
  const hosts = (env.TURNSTILE_HOSTNAMES ?? "voltip.firlab.app").split(",").map((h) => h.trim()).filter(Boolean);
  return result.success === true && typeof result.hostname === "string" && hosts.includes(result.hostname);
}
