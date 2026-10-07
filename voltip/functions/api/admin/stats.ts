import { stats } from "../../_lib/admin";
import { defaultDeps, type Env } from "../../_lib/env";

export const onRequestGet: PagesFunction<Env> = ({ request, env }) => stats(request, env, defaultDeps);
