import type { app } from "#src/shared/api/lexicons/index.ts";

export type Timeline = { feed: app.bsky.feed.defs.FeedViewPost[]; cursor?: string };
