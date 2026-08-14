import { AtUri } from "@atproto/api";
import type { AtUriString, DeleteOutput } from "@atproto/lex";

import { app } from "#src/shared/api/lexicons/index.ts";
import type { Session } from "#src/shared/auth/index.ts";

export async function unlikePost(session: Session, likeUri: AtUriString): Promise<DeleteOutput> {
  const { rkey } = new AtUri(likeUri);

  return await session.client.delete(app.bsky.feed.like, {
    rkey,
  });
}
