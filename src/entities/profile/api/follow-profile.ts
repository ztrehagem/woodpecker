import { AtUri, type Did } from "@atproto/api";
import {
  toDatetimeString,
  type AtUriString,
  type CreateOutput,
  type DeleteOutput,
} from "@atproto/lex";

import { app } from "#src/shared/api/lexicons/index.ts";
import type { Session } from "#src/shared/auth/index.ts";

export async function followProfile(session: Session, did: Did): Promise<CreateOutput> {
  return await session.client.create(app.bsky.graph.follow, {
    subject: did,
    createdAt: toDatetimeString(new Date()),
  });
}

export async function unfollowProfile(
  session: Session,
  followUri: AtUriString,
): Promise<DeleteOutput> {
  const { rkey } = new AtUri(followUri);

  return await session.client.delete(app.bsky.graph.follow, { rkey });
}
