import {
  infiniteQueryOptions,
  useInfiniteQuery,
  type InfiniteData,
  type UseInfiniteQueryResult,
} from "@tanstack/react-query";

import { app } from "#src/shared/api/lexicons/index.ts";
import type { Session } from "#src/shared/auth/index.ts";

const bookmarksQueryKeys = {
  all: ["bookmarks"] as const,
  list: (limit: number) => [...bookmarksQueryKeys.all, limit] as const,
};

type QueryKey = ReturnType<typeof bookmarksQueryKeys.list>;
type PageParam = string | null;
type Output = app.bsky.bookmark.getBookmarks.$OutputBody;

function bookmarksQuery(session: Session, limit = 50) {
  return infiniteQueryOptions<Output, Error, InfiniteData<Output, PageParam>, QueryKey, PageParam>({
    queryKey: bookmarksQueryKeys.list(limit),
    queryFn: async ({ pageParam }) =>
      await session.client.call(app.bsky.bookmark.getBookmarks, {
        limit,
        cursor: pageParam ?? void 0,
      }),
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.cursor ?? null,
  });
}

export function useBookmarksQuery(
  session: Session,
  limit = 50,
): UseInfiniteQueryResult<InfiniteData<Output, PageParam>> {
  return useInfiniteQuery(bookmarksQuery(session, limit));
}
