import type { Context } from "hono";
import { getCookie, setCookie } from "hono/cookie";
import { z } from "zod";

import type { HonoEnv } from "../hono-env";

/** @public */
export type SessionId = z.output<typeof schemaSessionId>;

/** @public */
export const schemaSessionId = z.string().brand("SessionId");

/** @public */
export async function requireCookieSessionId(
  c: Context<HonoEnv>,
): Promise<SessionId> {
  const sessionId = getCookieSessionId(c);

  if (sessionId == null) {
    return await allocateSessionId(c);
  }

  const { keys } = await c.env.KV_SESSION.list({ prefix: `${sessionId}|` });

  if (keys.length > 0) {
    return sessionId;
  }

  return await allocateSessionId(c);
}

const COOKIE_NAME_SESSION_ID = "session-id";

/** @public */
export function getCookieSessionId(c: Context<HonoEnv>): SessionId | null {
  return schemaSessionId
    .nullable()
    .parse(getCookie(c, COOKIE_NAME_SESSION_ID) ?? null);
}

function setCookieSessionId(c: Context<HonoEnv>, sessionId: SessionId): void {
  setCookie(c, COOKIE_NAME_SESSION_ID, sessionId, {
    domain: new URL(c.req.url).hostname,
    httpOnly: true,
    maxAge: 2592000, // 30 days
    partitioned: true,
    sameSite: "Strict",
    secure: true,
  });
}

async function allocateSessionId(c: Context<HonoEnv>): Promise<SessionId> {
  const uuid = crypto.randomUUID();

  const { keys } = await c.env.KV_SESSION.list({
    prefix: `${uuid}|`,
    limit: 1,
  });

  if (keys.length > 0) {
    throw new Error();
  }

  const sessionId = uuid as SessionId;

  setCookieSessionId(c, sessionId);

  return sessionId;
}
