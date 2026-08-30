import { usePreferencesQuery } from "#src/shared/api/index.ts";
import type { app } from "#src/shared/api/lexicons/index.ts";
import { useAssertSession } from "#src/shared/auth/index.ts";
import {
  getProfileModerationPolicy,
  type ModerationPolicy,
} from "#src/shared/lib/moderation-policy.ts";

type ProfileView =
  | app.bsky.actor.defs.ProfileView
  | app.bsky.actor.defs.ProfileViewBasic
  | app.bsky.actor.defs.ProfileViewDetailed;

export function useProfileModerationPolicy(profile: ProfileView): ModerationPolicy {
  const session = useAssertSession();
  const { data: preferences } = usePreferencesQuery(session);

  return getProfileModerationPolicy(profile, preferences?.moderationPrefs);
}
