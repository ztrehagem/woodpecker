import { usePreferencesQuery } from "#src/shared/api/index.ts";
import type { app } from "#src/shared/api/lexicons/index.ts";
import { useAssertSession } from "#src/shared/auth/index.ts";
import {
  getPostModerationPolicy,
  type ModerationPolicy,
} from "#src/shared/lib/moderation-policy.ts";

export function usePostModerationPolicy(post: app.bsky.feed.defs.PostView): ModerationPolicy {
  const session = useAssertSession();
  const { data: preferences } = usePreferencesQuery(session);

  return getPostModerationPolicy(post, preferences?.moderationPrefs, session.did);
}
