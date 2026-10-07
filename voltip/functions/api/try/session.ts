import { defaultDeps, type Env } from "../../_lib/env";
import { startSession } from "../../_lib/try";

export const onRequestPost: PagesFunction<Env> = ({ request, env }) => startSession(request, env, defaultDeps);
