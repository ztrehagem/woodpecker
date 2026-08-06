import type { AtIdentifierString, Client } from "@atproto/lex";
import { queryOptions } from "@tanstack/react-query";

import { app } from "#src/shared/api/lexicons/index.ts";

import type { Profile } from "../model/profile";

export const profileQueryKeys = {
  all: ["profile"] as const,
  detail: (actor: AtIdentifierString) => [...profileQueryKeys.all, actor] as const,
};

export function profileQuery(
  rpc: Client,
  actor: AtIdentifierString,
): ReturnType<
  typeof queryOptions<Profile, Error, Profile, ReturnType<typeof profileQueryKeys.detail>>
> {
  return queryOptions<Profile, Error, Profile, ReturnType<typeof profileQueryKeys.detail>>({
    queryKey: profileQueryKeys.detail(actor),
    queryFn: () => rpc.call(app.bsky.actor.getProfile, { actor }),
  });
}
