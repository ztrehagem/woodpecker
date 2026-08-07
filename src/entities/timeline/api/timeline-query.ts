import { infiniteQueryOptions, type InfiniteData } from "@tanstack/react-query";

import { app } from "#src/shared/api/lexicons/index.ts";
import type { Session } from "#src/shared/auth/index.ts";

import type { Timeline } from "../model/timeline";

export const timelineQueryKeys = {
  all: ["timeline"] as const,
  list: (limit: number) => [...timelineQueryKeys.all, limit] as const,
};

type QueryKey = ReturnType<typeof timelineQueryKeys.list>;
type PageParam = string | null;

export function timelineQuery(
  session: Session,
  limit = 50,
): ReturnType<
  typeof infiniteQueryOptions<
    Timeline,
    Error,
    InfiniteData<Timeline, PageParam>,
    QueryKey,
    PageParam
  >
> {
  return infiniteQueryOptions<
    Timeline,
    Error,
    InfiniteData<Timeline, PageParam>,
    QueryKey,
    PageParam
  >({
    queryKey: timelineQueryKeys.list(limit),
    queryFn: ({ pageParam }) =>
      session.client.call(app.bsky.feed.getTimeline, { limit, cursor: pageParam ?? void 0 }),
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.cursor ?? null,
  });
}
