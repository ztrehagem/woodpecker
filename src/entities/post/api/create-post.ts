import { toDatetimeString, type CreateOutput } from "@atproto/lex";

import { app } from "#src/shared/api/lexicons/index.ts";
import type { Session } from "#src/shared/lib/atproto/index.ts";

export function createPost(session: Session, text: string): Promise<CreateOutput> {
  return session.client.create(app.bsky.feed.post, {
    text,
    createdAt: toDatetimeString(new Date()),
  });
}
