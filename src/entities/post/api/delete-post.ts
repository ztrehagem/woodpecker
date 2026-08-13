import type { AtUriString, DeleteOutput } from "@atproto/lex";

import { app } from "#src/shared/api/lexicons/index.ts";
import type { Session } from "#src/shared/auth/index.ts";

export async function deletePost(session: Session, uri: AtUriString): Promise<DeleteOutput | void> {
  const [, rkey] = uri.match(/^at:\/\/[^/]+\/app\.bsky\.feed\.post\/([^/]+)($|[/?#])/) ?? [];

  if (rkey == null) {
    return;
  }

  return await session.client.delete(app.bsky.feed.post, {
    rkey,
  });
}
