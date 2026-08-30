import {
  infiniteQueryOptions,
  useInfiniteQuery,
  useQueryClient,
  type InfiniteData,
  type UseInfiniteQueryResult,
} from "@tanstack/react-query";

import { app } from "#src/shared/api/lexicons/index.ts";
import type { Session } from "#src/shared/auth/index.ts";

const moderatedAccountsQueryKeys = {
  mutes: (limit: number) => ["settings", "muted-accounts", limit] as const,
  blocks: (limit: number) => ["settings", "blocked-accounts", limit] as const,
};

type PageParam = string | null;

export function useMutedAccountsQuery(
  session: Session,
  limit = 50,
): UseInfiniteQueryResult<InfiniteData<app.bsky.graph.getMutes.$OutputBody, PageParam>> {
  const queryKey = moderatedAccountsQueryKeys.mutes(limit);

  return useInfiniteQuery(
    infiniteQueryOptions({
      queryKey,
      queryFn: ({ pageParam }) =>
        session.client.call(app.bsky.graph.getMutes, {
          limit,
          cursor: pageParam ?? void 0,
        }),
      initialPageParam: null as PageParam,
      getNextPageParam: (lastPage) => lastPage.cursor ?? null,
    }),
  );
}

export function useBlockedAccountsQuery(
  session: Session,
  limit = 50,
): UseInfiniteQueryResult<InfiniteData<app.bsky.graph.getBlocks.$OutputBody, PageParam>> {
  const queryKey = moderatedAccountsQueryKeys.blocks(limit);

  return useInfiniteQuery(
    infiniteQueryOptions({
      queryKey,
      queryFn: ({ pageParam }) =>
        session.client.call(app.bsky.graph.getBlocks, {
          limit,
          cursor: pageParam ?? void 0,
        }),
      initialPageParam: null as PageParam,
      getNextPageParam: (lastPage) => lastPage.cursor ?? null,
    }),
  );
}

export function useInvalidateMutedAccountsQuery(): () => Promise<void> {
  const queryClient = useQueryClient();

  return async () => {
    await queryClient.invalidateQueries({ queryKey: moderatedAccountsQueryKeys.mutes(50) });
  };
}

export function useInvalidateBlockedAccountsQuery(): () => Promise<void> {
  const queryClient = useQueryClient();

  return async () => {
    await queryClient.invalidateQueries({ queryKey: moderatedAccountsQueryKeys.blocks(50) });
  };
}
