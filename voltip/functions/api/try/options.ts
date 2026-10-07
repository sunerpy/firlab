import type { Env } from "../../_lib/env";
import { options } from "../../_lib/try";

export const onRequestGet: PagesFunction<Env> = ({ env }) => options(env);
