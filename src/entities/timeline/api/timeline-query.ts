import type { Client } from "@atproto/lex";
import { infiniteQueryOptions, type InfiniteData } from "@tanstack/react-query";

import { app } from "#src/shared/api/lexicons/index.ts";

import type { Timeline } from "../model/timeline";

export const timelineKeys = {
  all: ["timeline"] as const,
  list: (limit: number) => [...timelineKeys.all, limit] as const,
};

type TimelineQueryKey = ReturnType<typeof timelineKeys.list>;
type TimelinePageParam = string | null;

export function timelineQueryOptions(
  rpc: Client,
  limit = 50,
): ReturnType<
  typeof infiniteQueryOptions<
    Timeline,
    Error,
    InfiniteData<Timeline, TimelinePageParam>,
    TimelineQueryKey,
    TimelinePageParam
  >
> {
  return infiniteQueryOptions<
    Timeline,
    Error,
    InfiniteData<Timeline, TimelinePageParam>,
    TimelineQueryKey,
    TimelinePageParam
  >({
    queryKey: timelineKeys.list(limit),
    queryFn: ({ pageParam }) =>
      rpc.call(
        app.bsky.feed.getTimeline,
        pageParam == null ? { limit } : { limit, cursor: pageParam },
      ),
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.cursor ?? null,
  });
}
