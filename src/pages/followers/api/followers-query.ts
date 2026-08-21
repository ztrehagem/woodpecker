import type { AtIdentifierString } from "@atproto/lex";
import {
  infiniteQueryOptions,
  useInfiniteQuery,
  type InfiniteData,
  type UseInfiniteQueryResult,
} from "@tanstack/react-query";

import { app } from "#src/shared/api/lexicons/index.ts";
import type { Session } from "#src/shared/auth/index.ts";

const followersQueryKeys = {
  all: ["followers"] as const,
  list: (actor: AtIdentifierString, limit: number) =>
    [...followersQueryKeys.all, actor, limit] as const,
};

type QueryKey = ReturnType<typeof followersQueryKeys.list>;
type PageParam = string | null;
type Output = app.bsky.graph.getFollowers.$OutputBody;

function followersQuery(session: Session, actor: AtIdentifierString, limit = 50) {
  return infiniteQueryOptions<Output, Error, InfiniteData<Output, PageParam>, QueryKey, PageParam>({
    queryKey: followersQueryKeys.list(actor, limit),
    queryFn: ({ pageParam }) =>
      session.client.call(app.bsky.graph.getFollowers, {
        actor,
        limit,
        cursor: pageParam ?? void 0,
      }),
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.cursor ?? null,
  });
}

export function useFollowersQuery(
  session: Session,
  actor: AtIdentifierString,
  limit = 50,
): UseInfiniteQueryResult<InfiniteData<Output, PageParam>> {
  return useInfiniteQuery(followersQuery(session, actor, limit));
}
