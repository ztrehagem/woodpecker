import { usePreferencesQuery } from "#src/shared/api/index.ts";
import type { app } from "#src/shared/api/lexicons/index.ts";
import { useAssertSession } from "#src/shared/auth/index.ts";
import { getPostLabelPolicy, type LabelPolicy } from "#src/shared/lib/label-policy.ts";

export function usePostLabelPolicy(post: app.bsky.feed.defs.PostView): LabelPolicy {
  const session = useAssertSession();
  const { data: preferences } = usePreferencesQuery(session);

  return getPostLabelPolicy(post, preferences?.moderationPrefs, session.did);
}
