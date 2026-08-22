import type { AtUriString } from "@atproto/lex";
import { startTransition, useOptimistic, useSyncExternalStore } from "react";

import type { app } from "#src/shared/api/lexicons/index.ts";
import { useAssertSession } from "#src/shared/auth/index.ts";

import { repostPost } from "../../api/repost-post";
import { useInvalidateTimelineQuery } from "../../api/timeline-query";
import { unrepostPost } from "../../api/unrepost-post";
import type { Via } from "../../model/via";

export function useRepostState(
  postView: app.bsky.feed.defs.PostView,
  via?: Via,
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
      try {
        const { uri } = await repostPost(session, postView, { via });
        await invalidateTimelineQuery();
        session.repostCache.set(postView, uri);
      } catch (error) {
        console.error(error);
      }
    });
  };

  const unrepost = (): void => {
    if (repostUri == null) {
      return;
    }
    startTransition(async () => {
      setIsRepostedOptimistic(false);
      try {
        await unrepostPost(session, repostUri);
        await invalidateTimelineQuery();
        session.repostCache.set(postView, null);
      } catch (error) {
        console.error(error);
      }
    });
  };

  const toggleRepost = isRepostedOptimistic ? unrepost : repost;

  return [isRepostedOptimistic, toggleRepost];
}

function createVia(
  reason: app.bsky.feed.defs.FeedViewPost["reason"],
): { uri: AtUriString; cid: string } | undefined {
  if (!isReasonRepost(reason)) {
    return;
  }

  const { uri, cid } = reason;

  if (uri == null || cid == null) {
    return;
  }

  return { uri, cid };
}

function isReasonRepost(
  reason: app.bsky.feed.defs.FeedViewPost["reason"],
): reason is app.bsky.feed.defs.ReasonRepost & { $type: "app.bsky.feed.defs#reasonRepost" } {
  return reason?.$type === "app.bsky.feed.defs#reasonRepost";
}
