import { hc as honoClient } from "hono/client";

import type { App } from "../worker";

export const hc = honoClient<App>(origin);
