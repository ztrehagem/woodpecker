import { toDatetimeString, type AtUriString, type CreateOutput } from "@atproto/lex";

import { app } from "#src/shared/api/lexicons/index.ts";
import type { Session } from "#src/shared/auth/index.ts";

export async function likePost(
  session: Session,
  post: {
    uri: AtUriString;
    cid: string;
  },
  {
    via,
  }: {
    via?: {
      uri: AtUriString;
      cid: string;
    };
  } = {},
): Promise<CreateOutput> {
  return await session.client.create(app.bsky.feed.like, {
    subject: post,
    via: via,
    createdAt: toDatetimeString(new Date()),
  });
}
