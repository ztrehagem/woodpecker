import type { Context } from "hono";
import { z } from "zod";

import type { HonoEnv } from "../hono-env";
import type { SessionId } from "./session-id";

/** @public */
export type AtpSession = z.output<typeof schemaAtpSession>;

/** @public */
export const schemaAtpSession = z
  .object({
    service: z.string(),
    refreshJwt: z.string(),
    accessJwt: z.string(),
    handle: z.string(),
    did: z.string(),
    // email: z.string().nullish(),
    // emailConfirmed: z.boolean().nullish(),
    // emailAuthFactor: z.boolean().nullish(),
    // active: z.boolean(),
    // status: z.string().nullish(),
  })
  .brand("AtpSession");

/** @public */
export async function putAtpSession(
  c: Context<HonoEnv>,
  sessionId: SessionId,
  atpSession: AtpSession,
): Promise<void> {
  await c.env.KV_SESSION.put(
    `${sessionId}|${atpSession.did}`,
    JSON.stringify(atpSession),
    {
      expirationTtl: 2592000, // 30 days // same as ttl of refresh token
    },
  );
}

/** @public */
export async function listAtpSessions(
  c: Context<HonoEnv>,
  sessionId: SessionId,
): Promise<AtpSession[]> {
  const { keys } = await c.env.KV_SESSION.list({ prefix: `${sessionId}|` });
  const names = keys.map((key) => key.name);
  const map = await c.env.KV_SESSION.get<AtpSession>(names, "json");
  return [...map.values()].filter((v) => v != null);
}

/** @public */
export async function getAtpSession(
  c: Context<HonoEnv>,
  sessionId: SessionId,
  did: string,
): Promise<AtpSession | null> {
  return await c.env.KV_SESSION.get<AtpSession>(`${sessionId}|${did}`, "json");
}

/** @public */
export async function deleteAtpSession(
  c: Context<HonoEnv>,
  sessionId: SessionId,
  did: string,
): Promise<void> {
  await c.env.KV_SESSION.delete(`${sessionId}|${did}`);
}
