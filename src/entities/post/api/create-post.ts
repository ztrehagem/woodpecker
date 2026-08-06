import { toDatetimeString, type Client, type CreateOutput } from "@atproto/lex";

import { app } from "#src/shared/api/lexicons/index.ts";

export function createPost(rpc: Client, text: string): Promise<CreateOutput> {
  return rpc.create(app.bsky.feed.post, {
    text,
    createdAt: toDatetimeString(new Date()),
  });
}
