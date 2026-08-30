import type { BskyPreferences } from "@atproto/api";
import { queryOptions, useQuery, type UseQueryResult } from "@tanstack/react-query";

import type { Session } from "#src/shared/auth/index.ts";

export const preferencesQueryKey = ["preferences"] as const;

function preferencesQuery(session: Session) {
  return queryOptions<BskyPreferences>({
    queryKey: preferencesQueryKey,
    queryFn: () => session.agent.getPreferences(),
  });
}

export function usePreferencesQuery(session: Session): UseQueryResult<BskyPreferences> {
  return useQuery(preferencesQuery(session));
}
