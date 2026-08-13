import type { AtIdentifierString } from "@atproto/lex";
import {
  infiniteQueryOptions,
  useInfiniteQuery,
  type InfiniteData,
  type UseInfiniteQueryResult,
} from "@tanstack/react-query";

import { app } from "#src/shared/api/lexicons/index.ts";
import type { Session } from "#src/shared/auth/index.ts";

const authorFeedQueryKeys = {
  all: ["author-feed"] as const,
  actor: (actor: AtIdentifierString) => [...authorFeedQueryKeys.all, actor] as const,
  list: (actor: AtIdentifierString, limit: number) =>
    [...authorFeedQueryKeys.actor(actor), limit] as const,
};

type QueryKey = ReturnType<typeof authorFeedQueryKeys.list>;
type PageParam = string | null;
type AuthorFeed = app.bsky.feed.getAuthorFeed.$Output["body"];

function authorFeedQuery(session: Session, actor: AtIdentifierString, limit = 50) {
  return infiniteQueryOptions<
    AuthorFeed,
    Error,
    InfiniteData<AuthorFeed, PageParam>,
    QueryKey,
    PageParam
  >({
    queryKey: authorFeedQueryKeys.list(actor, limit),
    queryFn: ({ pageParam }) =>
      session.client.call(app.bsky.feed.getAuthorFeed, {
        actor,
        limit,
        cursor: pageParam ?? void 0,
      }),
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.cursor ?? null,
  });
}

export function useAuthorFeedQuery(
  session: Session,
  actor: AtIdentifierString,
  limit = 50,
): UseInfiniteQueryResult<InfiniteData<AuthorFeed, PageParam>> {
  return useInfiniteQuery(authorFeedQuery(session, actor, limit));
}
