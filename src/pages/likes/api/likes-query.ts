import type { Did } from "@atproto/api";
import {
  infiniteQueryOptions,
  useInfiniteQuery,
  type InfiniteData,
  type UseInfiniteQueryResult,
} from "@tanstack/react-query";

import { app } from "#src/shared/api/lexicons/index.ts";
import type { Session } from "#src/shared/auth/index.ts";

const likesQueryKeys = {
  all: ["likes"] as const,
  list: (actor: Did, limit: number) => [...likesQueryKeys.all, actor, limit] as const,
};

type QueryKey = ReturnType<typeof likesQueryKeys.list>;
type PageParam = string | null;
type Output = app.bsky.feed.getActorLikes.$OutputBody;

function likesQuery(session: Session, actor: Did, limit = 50) {
  return infiniteQueryOptions<Output, Error, InfiniteData<Output, PageParam>, QueryKey, PageParam>({
    queryKey: likesQueryKeys.list(actor, limit),
    queryFn: async ({ pageParam }) =>
      await session.client.call(app.bsky.feed.getActorLikes, {
        actor,
        limit,
        cursor: pageParam ?? void 0,
      }),
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.cursor ?? null,
  });
}

export function useLikesQuery(
  session: Session,
  actor: Did,
  limit = 50,
): UseInfiniteQueryResult<InfiniteData<Output, PageParam>> {
  return useInfiniteQuery(likesQuery(session, actor, limit));
}
