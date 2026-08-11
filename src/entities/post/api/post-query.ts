import type { AtUriString } from "@atproto/lex";
import { queryOptions, useQuery, useQueryClient, type UseQueryResult } from "@tanstack/react-query";

import { app } from "#src/shared/api/lexicons/index.ts";
import type { Session } from "#src/shared/auth/index.ts";

const postQueryKeys = {
  all: ["posts"] as const,
  single: (uri: AtUriString) => [...postQueryKeys.all, uri] as const,
  detail: (uri: AtUriString, depth?: number, parentHeight?: number) =>
    [...postQueryKeys.all, uri, depth, parentHeight] as const,
};

type Output = app.bsky.feed.getPostThread.$Output["body"];

function postQuery(
  session: Session,
  uri: AtUriString,
  {
    depth,
    parentHeight,
  }: {
    depth?: number;
    parentHeight?: number;
  },
) {
  return queryOptions<Output>({
    queryKey: postQueryKeys.detail(uri, depth, parentHeight),
    queryFn: () => session.client.call(app.bsky.feed.getPostThread, { uri, depth, parentHeight }),
  });
}

export function usePostQuery(
  session: Session,
  uri: AtUriString,
  {
    depth,
    parentHeight,
  }: {
    depth?: number;
    parentHeight?: number;
  } = {},
): UseQueryResult<Output> {
  return useQuery(postQuery(session, uri, { depth, parentHeight }));
}

export function useInvalidatePostQuery(): (uri: AtUriString) => Promise<void> {
  const queryClient = useQueryClient();

  return async (uri) => {
    await queryClient.invalidateQueries({ queryKey: postQueryKeys.detail(uri) });
  };
}
