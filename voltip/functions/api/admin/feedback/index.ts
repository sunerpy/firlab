import { defaultDeps, type Env } from "../../../_lib/env";
import { listFeedback } from "../../../_lib/feedback";

export const onRequestGet: PagesFunction<Env> = ({ request, env }) => listFeedback(request, env, defaultDeps);
