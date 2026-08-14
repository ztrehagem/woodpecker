import type { AtUriString } from "@atproto/lex";

import { app } from "#src/shared/api/lexicons/index.ts";
import type { Session } from "#src/shared/auth/index.ts";

export async function savePost(
  session: Session,
  post: { uri: AtUriString; cid: string },
): Promise<void> {
  await session.client.call(app.bsky.bookmark.createBookmark, {
    uri: post.uri,
    cid: post.cid,
  });
}
