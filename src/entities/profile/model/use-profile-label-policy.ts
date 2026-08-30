import { usePreferencesQuery } from "#src/shared/api/index.ts";
import type { app } from "#src/shared/api/lexicons/index.ts";
import { useAssertSession } from "#src/shared/auth/index.ts";
import { getProfileLabelPolicy, type LabelPolicy } from "#src/shared/lib/label-policy.ts";

type ProfileView =
  | app.bsky.actor.defs.ProfileView
  | app.bsky.actor.defs.ProfileViewBasic
  | app.bsky.actor.defs.ProfileViewDetailed;

export function useProfileLabelPolicy(profile: ProfileView): LabelPolicy {
  const session = useAssertSession();
  const { data: preferences } = usePreferencesQuery(session);

  return getProfileLabelPolicy(profile, preferences?.moderationPrefs.adultContentEnabled);
}
