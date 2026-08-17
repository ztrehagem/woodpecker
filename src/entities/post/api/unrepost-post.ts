import { AtUri } from "@atproto/api";
import type { AtUriString, DeleteOutput } from "@atproto/lex";

import { app } from "#src/shared/api/lexicons/index.ts";
import type { Session } from "#src/shared/auth/index.ts";

export async function unrepostPost(
  session: Session,
  repostUri: AtUriString,
): Promise<DeleteOutput> {
  const { rkey } = new AtUri(repostUri);

  return await session.client.delete(app.bsky.feed.repost, {
    rkey,
  });
}
