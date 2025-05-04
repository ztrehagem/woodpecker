import { Hono } from "hono";
import { csrf } from "hono/csrf";
import { logger } from "hono/logger";
import { secureHeaders } from "hono/secure-headers";

import {
  pathnameClientMetadataJson,
  pathnameJwksJson,
  pathnameLogin,
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
  .get(pathnameLogin, async (c) => {
    console.log("login", c.req.query("handle"));
    const id = c.env.ATP_OAUTH_CLIENT.idFromName("shared");
    const client = c.env.ATP_OAUTH_CLIENT.get(id);
    const response = await client.fetch(c.req.raw);
    return new Response(response.body, response);
  });
// .on(
//   "GET",
//   [pathnameClientMetadataJson, pathnameJwksJson, pathnameLogin],
//   async (c) => {
//     const id = c.env.ATP_OAUTH_CLIENT.idFromName("shared");
//     const client = c.env.ATP_OAUTH_CLIENT.get(id);
//     const response = await client.fetch(c.req.raw);
//     return new Response(response.body, response);
//   },
// );
// .put("/atpSession", zValidator("json", schemaAtpSession), async (c) => {
//   const atpSession = c.req.valid("json");

//   const sessionId = await requireCookieSessionId(c);

//   await putAtpSession(c, sessionId, atpSession);

//   return c.body(null, 204);
// })
// .get("/atpUsers", async (c) => {
//   const sessionId = getCookieSessionId(c);

//   if (sessionId == null) {
//     return c.body(null, 404);
//   }

//   const sessions = await listAtpSessions(c, sessionId);

//   return c.json(
//     sessions.map(
//       (session) => ({
//         handle: session.handle,
//         did: session.did,
//       }),
//       200,
//     ),
//   );
// })
// .get(
//   "/atpSession",
//   zValidator("json", z.object({ did: z.string() })),
//   async (c) => {
//     const sessionId = getCookieSessionId(c);

//     if (sessionId == null) {
//       return c.body(null, 404);
//     }

//     const { did } = c.req.valid("json");

//     const atpSession = await getAtpSession(c, sessionId, did);

//     if (atpSession == null) {
//       return c.body(null, 404);
//     }

//     return c.json(atpSession, 200);
//   },
// )
// .delete(
//   "/atpSession",
//   zValidator("json", z.object({ did: z.string() })),
//   async (c) => {
//     const sessionId = getCookieSessionId(c);

//     if (sessionId == null) {
//       return c.body(null, 204);
//     }

//     const { did } = c.req.valid("json");

//     await deleteAtpSession(c, sessionId, did);

//     return c.body(null, 204);
//   },
// )
