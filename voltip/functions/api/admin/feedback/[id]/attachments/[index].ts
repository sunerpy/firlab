import { defaultDeps, type Env } from "../../../../../_lib/env";
import { feedbackAttachment } from "../../../../../_lib/feedback";

export const onRequestGet: PagesFunction<Env> = ({ request, env, params }) =>
  feedbackAttachment(request, env, defaultDeps, String(params.id), String(params.index));
