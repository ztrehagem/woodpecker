import type { app } from "#src/shared/api/lexicons/index.ts";

export type NewPostDialogPayload =
  // new post
  | undefined
  | null
  // reply post
  | { replyPostView: app.bsky.feed.defs.PostView }
  // quote post
  | { quotePostView: app.bsky.feed.defs.PostView };
