import { logout } from "../../_lib/admin";
import type { Env } from "../../_lib/env";

export const onRequestPost: PagesFunction<Env> = ({ request }) => logout(request);
