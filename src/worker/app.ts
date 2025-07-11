import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { csrf } from "hono/csrf";
import { logger } from "hono/logger";
import { secureHeaders } from "hono/secure-headers";
import { z } from "zod";

import {
  pathnameClientMetadataJson,
  pathnameJwksJson,
} from "./durable-object/atp-oauth-client";
import type { HonoEnv } from "./hono-env";

export const app = new Hono<HonoEnv>()
  .use(logger())
  .use(secureHeaders())
  .use(
    csrf({
      origin: (origin) => {
        if (import.meta.env.DEV) {
          return true;
        }
        return /^https:\/\/(woodpecker.ztrehagem.app|.*\.ztrehagem\.workers\.dev)$/.test(
          origin,
        );
      },
    }),
  )
  .get(pathnameClientMetadataJson, async (c) => {
    const id = c.env.ATP_OAUTH_CLIENT.idFromName("shared");
    const client = c.env.ATP_OAUTH_CLIENT.get(id);
    const response = await client.fetch(c.req.raw);
    return new Response(response.body, response);
  })
  .get(pathnameJwksJson, async (c) => {
    const id = c.env.ATP_OAUTH_CLIENT.idFromName("shared");
    const client = c.env.ATP_OAUTH_CLIENT.get(id);
    const response = await client.fetch(c.req.raw);
    return new Response(response.body, response);
  })
  .post(
    "/api/login",
    zValidator(
      "json",
      z.object({
        handle: z.string(),
      }),
    ),
    async (c) => {
      const id = c.env.ATP_OAUTH_CLIENT.idFromName("shared");
      const client = c.env.ATP_OAUTH_CLIENT.get(id);

      const { handle } = c.req.valid("json");

      const redirectTo = await client.getOAuthLoginUrl({ handle });

      return c.json({ redirectTo });
    },
  );
