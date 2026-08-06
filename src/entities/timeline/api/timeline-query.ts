import type { Client } from "@atproto/lex";
import { queryOptions } from "@tanstack/react-query";

import { app } from "#src/shared/api/lexicons/index.ts";

import type { FeedViewPost } from "../model/feed-view-post";

export const timelineKeys = {
  all: ["timeline"] as const,
  list: (limit: number) => [...timelineKeys.all, limit] as const,
};

type TimelineQueryKey = ReturnType<typeof timelineKeys.list>;

export function timelineQueryOptions(
  rpc: Client,
  limit = 50,
): ReturnType<typeof queryOptions<FeedViewPost[], Error, FeedViewPost[], TimelineQueryKey>> {
  return queryOptions({
    queryKey: timelineKeys.list(limit),
    queryFn: async () => (await rpc.call(app.bsky.feed.getTimeline, { limit })).feed,
  });
}
