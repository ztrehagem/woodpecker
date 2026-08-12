import type { Did } from "@atproto/api";
import {
  infiniteQueryOptions,
  useInfiniteQuery,
  type InfiniteData,
  type UseInfiniteQueryResult,
} from "@tanstack/react-query";

import { app } from "#src/shared/api/lexicons/index.ts";
import type { Session } from "#src/shared/auth/index.ts";

const notificationsQueryKeys = {
  all: ["notifications"] as const,
  list: (actor: Did, limit: number) => [...notificationsQueryKeys.all, actor, limit] as const,
};

type QueryKey = ReturnType<typeof notificationsQueryKeys.list>;
type PageParam = string | null;
type Output = app.bsky.notification.listNotifications.$OutputBody;

function notificationsQuery(session: Session, actor: Did, limit = 50) {
  return infiniteQueryOptions<Output, Error, InfiniteData<Output, PageParam>, QueryKey, PageParam>({
    queryKey: notificationsQueryKeys.list(actor, limit),
    queryFn: async ({ pageParam }) =>
      await session.client.call(app.bsky.notification.listNotifications, {
        limit,
        cursor: pageParam ?? void 0,
      }),
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.cursor ?? null,
  });
}

export function useNotificationsQuery(
  session: Session,
  actor: Did,
  limit = 50,
): UseInfiniteQueryResult<InfiniteData<Output, PageParam>> {
  return useInfiniteQuery(notificationsQuery(session, actor, limit));
}
