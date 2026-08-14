import type { AtUriString } from "@atproto/lex";

import { app } from "#src/shared/api/lexicons/index.ts";
import type { Session } from "#src/shared/auth/session.ts";

export async function unsavePost(session: Session, post: { uri: AtUriString }): Promise<void> {
  await session.client.call(app.bsky.bookmark.deleteBookmark, {
    uri: post.uri,
  });
}
