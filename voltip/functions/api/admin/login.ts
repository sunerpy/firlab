import { login } from "../../_lib/admin";
import { defaultDeps, type Env } from "../../_lib/env";

export const onRequestPost: PagesFunction<Env> = ({ request, env }) => login(request, env, defaultDeps);
