import type { app } from "#src/shared/api/lexicons/index.ts";

export function isPostRecord(obj: object): obj is app.bsky.feed.post.Main {
  return "$type" in obj && obj.$type === "app.bsky.feed.post";
}
