import { defaultDeps, type Env } from "../../_lib/env";
import { polish } from "../../_lib/try";

export const onRequestPost: PagesFunction<Env> = ({ request, env }) => polish(request, env, defaultDeps);
