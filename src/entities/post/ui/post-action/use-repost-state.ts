import { startTransition, useOptimistic, useSyncExternalStore } from "react";

import type { app } from "#src/shared/api/lexicons/index.ts";
import { useAssertSession } from "#src/shared/auth/index.ts";

import { repostPost } from "../../api/repost-post";
import { useInvalidateTimelineQuery } from "../../api/timeline-query";
import { unrepostPost } from "../../api/unrepost-post";

export function useRepostState(
  postView: app.bsky.feed.defs.PostView,
): readonly [isReposted: boolean, toggleRepost: () => void] {
  const session = useAssertSession();
  const invalidateTimelineQuery = useInvalidateTimelineQuery();

  const repostUri = useSyncExternalStore(session.repostCache.subscribe, () =>
    session.repostCache.get(postView),
  );
  const [isRepostedOptimistic, setIsRepostedOptimistic] = useOptimistic<boolean>(repostUri != null);

  const repost = (): void => {
    if (repostUri != null) {
      return;
    }
    startTransition(async () => {
      setIsRepostedOptimistic(true);
      const { uri } = await repostPost(session, postView);
      await invalidateTimelineQuery();
      session.repostCache.set(postView, uri);
    });
  };

  const unrepost = (): void => {
    if (repostUri == null) {
      return;
    }
    startTransition(async () => {
      setIsRepostedOptimistic(false);
      await unrepostPost(session, repostUri);
      await invalidateTimelineQuery();
      session.repostCache.set(postView, null);
    });
  };

  const toggleRepost = isRepostedOptimistic ? unrepost : repost;

  return [isRepostedOptimistic, toggleRepost];
}
