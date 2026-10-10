import { route } from "../_lib/updates";

/** `/updates/latest.json`, `/updates/android.json` and `/updates/download/<tag>/<file>`. */
export const onRequest: PagesFunction = ({ request, params }) => {
  const path = params.path;
  return route(request, Array.isArray(path) ? path : path ? [path] : []);
};
