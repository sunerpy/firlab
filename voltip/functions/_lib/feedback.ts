/**
 * The admin page's feedback list. The reports live behind the feedback Worker (voltip
 * services/feedback, docs/feedback.md); this side holds that Worker's admin token and uses it only
 * for a signed-in session, so the token never reaches the browser. The page reads the reports,
 * marks one handled or open again, and downloads an attachment.
 */
import { signedIn } from "./admin";
import type { Deps, Env } from "./env";
import { fail, json, sameOrigin } from "./http";

/** A report id as the Worker makes them (a UUID) or its routes accept them. */
const REPORT_ID = /^[0-9A-Za-z-]{1,64}$/u;
export const FEEDBACK_STATES = ["open", "handled", "all"] as const;
export const FEEDBACK_PAGE_MAX = 100;
export const FEEDBACK_TIMEOUT_MS = 15_000;

type Forwarded = { answer: Response } | { error: Response };

/** One request to the Worker with its admin token; a failure becomes the page's error. */
async function forward(env: Env, deps: Deps, path: string, method = "GET"): Promise<Forwarded> {
  if (!env.FEEDBACK_API || !env.FEEDBACK_ADMIN_TOKEN) return { error: fail(503, "feedback_unconfigured") };
  try {
    const answer = await deps.fetch(`${env.FEEDBACK_API}${path}`, {
      method,
      headers: { authorization: `Bearer ${env.FEEDBACK_ADMIN_TOKEN}` },
      signal: AbortSignal.timeout(FEEDBACK_TIMEOUT_MS),
    });
    if (answer.status === 404) return { error: fail(404, "feedback_not_found") };
    if (!answer.ok) return { error: fail(502, "feedback_failed", { status: answer.status }) };
    return { answer };
  } catch {
    return { error: fail(502, "feedback_unreachable") };
  }
}

/** `GET /api/admin/feedback?state=&before=&limit=`: a page of reports, newest first. */
export async function listFeedback(request: Request, env: Env, deps: Deps): Promise<Response> {
  if (!(await signedIn(request, env, deps))) return fail(401, "signed_out");
  const url = new URL(request.url);
  const asked = url.searchParams.get("state") ?? "open";
  const state = (FEEDBACK_STATES as readonly string[]).includes(asked) ? asked : "open";
  const limit = Math.min(FEEDBACK_PAGE_MAX, Math.max(1, Number.parseInt(url.searchParams.get("limit") ?? "", 10) || 30));
  const query = new URLSearchParams({ state, limit: String(limit) });
  const before = url.searchParams.get("before") ?? "";
  if (/^\d{1,16}$/u.test(before)) query.set("before", before);
  const forwarded = await forward(env, deps, `?${query.toString()}`);
  if ("error" in forwarded) return forwarded.error;
  return json(await forwarded.answer.json());
}

/** `POST /api/admin/feedback/handled` `{id, handled}`: the 已处理 mark, set or taken off. */
export async function markFeedback(request: Request, env: Env, deps: Deps): Promise<Response> {
  if (!sameOrigin(request)) return fail(403, "cross_origin");
  if (!(await signedIn(request, env, deps))) return fail(401, "signed_out");
  const body = (await request.json().catch(() => null)) as { id?: unknown; handled?: unknown } | null;
  const id = typeof body?.id === "string" ? body.id : "";
  if (!REPORT_ID.test(id) || typeof body?.handled !== "boolean") return fail(400, "invalid");
  const forwarded = await forward(env, deps, `/${id}/handled`, body.handled ? "PUT" : "DELETE");
  if ("error" in forwarded) return forwarded.error;
  return json(await forwarded.answer.json());
}

/** `GET /api/admin/feedback/<id>/attachments/<index>`: an attachment as a download, never shown
 *  inline on this site's origin. */
export async function feedbackAttachment(request: Request, env: Env, deps: Deps, id: string, index: string): Promise<Response> {
  if (!(await signedIn(request, env, deps))) return fail(401, "signed_out");
  if (!REPORT_ID.test(id) || !/^\d$/u.test(index)) return fail(400, "invalid");
  const forwarded = await forward(env, deps, `/${id}/attachments/${index}`);
  if ("error" in forwarded) return forwarded.error;
  const { answer } = forwarded;
  return new Response(answer.body, {
    headers: {
      "content-type": answer.headers.get("content-type") ?? "application/octet-stream",
      "content-disposition": answer.headers.get("content-disposition") ?? "attachment",
      "cache-control": "no-store",
      "x-content-type-options": "nosniff",
      "content-security-policy": "sandbox",
    },
  });
}
