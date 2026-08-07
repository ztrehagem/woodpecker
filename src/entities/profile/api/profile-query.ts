import type { AtIdentifierString } from "@atproto/lex";
import { queryOptions, useQuery, type UseQueryResult } from "@tanstack/react-query";

import { app } from "#src/shared/api/lexicons/index.ts";
import type { Session } from "#src/shared/auth/index.ts";

import type { Profile } from "../model/profile";

const profileQueryKeys = {
  all: ["profile"] as const,
  detail: (actor: AtIdentifierString) => [...profileQueryKeys.all, actor] as const,
};

function profileQuery(session: Session, actor: AtIdentifierString) {
  return queryOptions<Profile>({
    queryKey: profileQueryKeys.detail(actor),
    queryFn: () => session.client.call(app.bsky.actor.getProfile, { actor }),
  });
}

export function useProfileQuery(
  session: Session,
  actor: AtIdentifierString,
): UseQueryResult<Profile> {
  return useQuery(profileQuery(session, actor));
}
