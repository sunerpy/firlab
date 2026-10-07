import { fail } from "../_lib/http";

/** Anything under /api/ that no route answers is a JSON 404, never a page of the site. */
export const onRequest: PagesFunction = async ({ next }) => {
  try {
    const response = await next();
    if (response.status === 404 && !(response.headers.get("content-type") ?? "").includes("json")) return fail(404, "not_found");
    return response;
  } catch {
    return fail(500, "internal");
  }
};
