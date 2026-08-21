import type { AtIdentifierString } from "@atproto/lex";
import {
  infiniteQueryOptions,
  useInfiniteQuery,
  type InfiniteData,
  type UseInfiniteQueryResult,
} from "@tanstack/react-query";

import { app } from "#src/shared/api/lexicons/index.ts";
import type { Session } from "#src/shared/auth/index.ts";

const followsQueryKeys = {
  all: ["follows"] as const,
  list: (actor: AtIdentifierString, limit: number) =>
    [...followsQueryKeys.all, actor, limit] as const,
};

type QueryKey = ReturnType<typeof followsQueryKeys.list>;
type PageParam = string | null;
type Output = app.bsky.graph.getFollows.$OutputBody;

function followsQuery(session: Session, actor: AtIdentifierString, limit = 50) {
  return infiniteQueryOptions<Output, Error, InfiniteData<Output, PageParam>, QueryKey, PageParam>({
    queryKey: followsQueryKeys.list(actor, limit),
    queryFn: ({ pageParam }) =>
      session.client.call(app.bsky.graph.getFollows, {
        actor,
        limit,
        cursor: pageParam ?? void 0,
      }),
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.cursor ?? null,
  });
}

export function useFollowsQuery(
  session: Session,
  actor: AtIdentifierString,
  limit = 50,
): UseInfiniteQueryResult<InfiniteData<Output, PageParam>> {
  return useInfiniteQuery(followsQuery(session, actor, limit));
}
