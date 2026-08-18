import {
  infiniteQueryOptions,
  useInfiniteQuery,
  useQueryClient,
  type InfiniteData,
  type InvalidateQueryFilters,
  type UseInfiniteQueryResult,
} from "@tanstack/react-query";

import { app } from "#src/shared/api/lexicons/index.ts";
import type { Session } from "#src/shared/auth/index.ts";

export const timelineQueryKeys = {
  all: ["timeline"] as const,
  list: (limit: number) => [...timelineQueryKeys.all, limit] as const,
};

type QueryKey = ReturnType<typeof timelineQueryKeys.list>;
type PageParam = string | null;
type Timeline = app.bsky.feed.getTimeline.$Output["body"];

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

export function useTimelineQuery(
  session: Session,
  limit = 50,
): UseInfiniteQueryResult<InfiniteData<Timeline, PageParam>> {
  return useInfiniteQuery(timelineQuery(session, limit));
}

export function useInvalidateTimelineQuery(): (
  filter?: Pick<InvalidateQueryFilters, "stale">,
) => Promise<void> {
  const queryClient = useQueryClient();

  return async (filter) => {
    await queryClient.invalidateQueries({ ...filter, queryKey: timelineQueryKeys.all });
  };
}
