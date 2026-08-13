import { Menu } from "@base-ui/react";
import { clsx } from "clsx";
import React, { useState } from "react";

import type { app } from "#src/shared/api/lexicons/index.ts";
import { useAssertSession } from "#src/shared/auth/index.ts";
import {
  FavoriteFillIcon,
  FavoriteIcon,
  MoreHorizIcon,
  RepeatIcon,
  ReplyIcon,
} from "#src/shared/ui/icon/index.ts";

import { likePost } from "../api/like-post";
import { unlikePost } from "../api/unlike-post";
import { formatCompactCount } from "../lib/format-compact-count";

export function PostActionUI({
  postView,
}: {
  postView: app.bsky.feed.defs.PostView;
}): React.ReactElement {
  const { isLiked, toggleLike } = useLikeState(postView);

  return (
    <div className="mt-2 flex items-center justify-between gap-4">
      <ul className="grid grow grid-cols-3 gap-x-4 gap-y-1 text-sm font-light text-fg-muted">
        <li className="flex items-center gap-x-1">
          <button
            type="button"
            className="relative -m-2 flex cursor-pointer items-center gap-x-1 p-2 text-fg-muted"
          >
            <ReplyIcon aria-label="Replies" className="size-5" />
            {formatCompactCount(postView.replyCount ?? 0)}
          </button>
        </li>

        <li className="flex items-center gap-x-1">
          <button
            type="button"
            className="relative -m-2 flex cursor-pointer items-center gap-x-1 p-2 text-fg-muted"
          >
            <RepeatIcon aria-label="Reposts" className="size-5" />
            {formatCompactCount((postView.repostCount ?? 0) + (postView.quoteCount ?? 0))}
          </button>
        </li>

        <li className="flex items-center gap-x-1">
          <button
            type="button"
            onClick={toggleLike}
            aria-pressed={isLiked}
            className={clsx(
              "relative -m-2 flex cursor-pointer items-center gap-x-1 p-2",
              isLiked ? "text-fg-like" : "text-fg-muted",
            )}
          >
            {isLiked ? (
              <FavoriteFillIcon aria-label="Likes" className="size-5" />
            ) : (
              <FavoriteIcon aria-label="Likes" className="size-5" />
            )}
            {formatCompactCount(
              (postView.likeCount ?? 0) -
                (postView.viewer?.like != null ? 1 : 0) +
                (isLiked ? 1 : 0),
            )}
          </button>
        </li>
      </ul>

      <MoreMenu />
    </div>
  );
}

function useLikeState(postView: app.bsky.feed.defs.PostView) {
  const session = useAssertSession();

  const [isLiked, setIsLiked] = useState(session.likeCache.get(postView) != null);

  const like = (): void => {
    if (session.likeCache.get(postView) != null) {
      return;
    }
    setIsLiked(true);
    likePost(session, postView.uri, postView.cid)
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

  return { isLiked, toggleLike };
}

function MoreMenu(): React.ReactElement {
  const itemClassName = clsx(
    "flex cursor-pointer items-center gap-2 px-5 py-2 text-sm text-inherit hover:bg-highlight",
  );

  return (
    <Menu.Root>
      <Menu.Trigger
        className="relative -m-2 flex cursor-pointer items-center gap-x-1 p-2 text-fg-muted"
        render={(props) => <button type="button" {...props} />}
      >
        <MoreHorizIcon aria-label="More" className="size-5" />
      </Menu.Trigger>

      <Menu.Portal className="relative z-50">
        <Menu.Positioner side="bottom" sideOffset={8} align="end">
          <Menu.Popup className="relative rounded-md border border-highlight bg-filling/75 py-2 backdrop-blur-sm">
            <Menu.Item className={itemClassName}>More actions (Coming soon)</Menu.Item>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
}
