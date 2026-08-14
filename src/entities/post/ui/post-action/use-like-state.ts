import { useState } from "react";

import type { app } from "#src/shared/api/lexicons/index.ts";
import { useAssertSession } from "#src/shared/auth/index.ts";

import { likePost } from "../../api/like-post";
import { unlikePost } from "../../api/unlike-post";

export function useLikeState(
  postView: app.bsky.feed.defs.PostView,
): readonly [isLiked: boolean, toggleLike: () => void] {
  const session = useAssertSession();

  const [isLiked, setIsLiked] = useState(session.likeCache.get(postView) != null);

  const like = (): void => {
    if (session.likeCache.get(postView) != null) {
      return;
    }
    setIsLiked(true);
    likePost(session, postView)
      .then(({ uri: likeUri }) => {
        session.likeCache.set(postView, likeUri);
      })
      .catch(() => {
        setIsLiked(false);
      });
  };

  const unlike = (): void => {
    const likeUri = session.likeCache.get(postView);
    if (likeUri == null) {
      return;
    }
    setIsLiked(false);
    unlikePost(session, likeUri)
      .then(() => {
        session.likeCache.set(postView, null);
      })
      .catch(() => {
        setIsLiked(true);
      });
  };

  const toggleLike = isLiked ? unlike : like;

  return [isLiked, toggleLike];
}
