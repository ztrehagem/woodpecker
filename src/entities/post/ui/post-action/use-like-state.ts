import { startTransition, useOptimistic, useSyncExternalStore } from "react";

import type { app } from "#src/shared/api/lexicons/index.ts";
import { useAssertSession } from "#src/shared/auth/index.ts";

import { likePost } from "../../api/like-post";
import { unlikePost } from "../../api/unlike-post";

export function useLikeState(
  postView: app.bsky.feed.defs.PostView,
): readonly [isLiked: boolean, toggleLike: () => void] {
  const session = useAssertSession();

  // const [isLiked, setIsLiked] = useState(session.likeCache.get(postView) != null);
  const likeUri = useSyncExternalStore(session.likeCache.subscribe, () =>
    session.likeCache.get(postView),
  );
  const [isLikedOptimistic, setIsLikedOptimistic] = useOptimistic<boolean>(likeUri != null);

  const like = (): void => {
    if (likeUri != null) {
      return;
    }
    startTransition(async () => {
      setIsLikedOptimistic(true);
      const { uri } = await likePost(session, postView);
      session.likeCache.set(postView, uri);
    });
  };

  const unlike = (): void => {
    if (likeUri == null) {
      return;
    }
    startTransition(async () => {
      setIsLikedOptimistic(false);
      await unlikePost(session, likeUri);
      session.likeCache.set(postView, null);
    });
  };

  const toggleLike = isLikedOptimistic ? unlike : like;

  return [isLikedOptimistic, toggleLike];
}
