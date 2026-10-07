import { defaultDeps, type Env } from "../../_lib/env";
import { transcribe } from "../../_lib/try";

export const onRequestPost: PagesFunction<Env> = ({ request, env }) => transcribe(request, env, defaultDeps);
