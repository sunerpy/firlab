import { receiveEdgeStats } from "../../_lib/admin";
import { defaultDeps, type Env } from "../../_lib/env";

export const onRequestPost: PagesFunction<Env> = ({ request, env }) => receiveEdgeStats(request, env, defaultDeps);
