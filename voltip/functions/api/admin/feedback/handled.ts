import { defaultDeps, type Env } from "../../../_lib/env";
import { markFeedback } from "../../../_lib/feedback";

export const onRequestPost: PagesFunction<Env> = ({ request, env }) => markFeedback(request, env, defaultDeps);
