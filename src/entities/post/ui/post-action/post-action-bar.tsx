import { clsx } from "clsx";
import React from "react";

import type { app } from "#src/shared/api/lexicons/index.ts";
import {
  FavoriteFillIcon,
  FavoriteIcon,
  RepeatIcon,
  ReplyIcon,
} from "#src/shared/ui/icon/index.ts";

import { formatCompactCount } from "../../lib/format-compact-count";
import { MoreActions } from "./more-actions";
import { useLikeState } from "./use-like-state";

export function PostActionBar({
  postView,
}: {
  postView: app.bsky.feed.defs.PostView;
}): React.ReactElement {
  return (
    <div className="mt-2 flex items-center justify-between gap-4">
      <MainActions postView={postView} />
      <MoreActions postView={postView} />
    </div>
  );
}

function MainActions({ postView }: { postView: app.bsky.feed.defs.PostView }): React.ReactElement {
  return (
    <ul className="grid grow grid-cols-3 gap-x-4 gap-y-1 text-sm font-light text-fg-muted">
      <li className="flex items-center gap-x-1">
        <ReplyButton postView={postView} />
      </li>

      <li className="flex items-center gap-x-1">
        <RepostButton postView={postView} />
      </li>

      <li className="flex items-center gap-x-1">
        <LikeButton postView={postView} />
      </li>
    </ul>
  );
}

function ReplyButton({ postView }: { postView: app.bsky.feed.defs.PostView }): React.ReactElement {
  return (
    <button
      type="button"
      className="relative -m-2 flex cursor-pointer items-center gap-x-1 p-2 text-fg-muted"
    >
      <ReplyIcon aria-label="Replies" className="size-5" />
      {formatCompactCount(postView.replyCount ?? 0)}
    </button>
  );
}

function RepostButton({ postView }: { postView: app.bsky.feed.defs.PostView }): React.ReactElement {
  return (
    <button
      type="button"
      className="relative -m-2 flex cursor-pointer items-center gap-x-1 p-2 text-fg-muted"
    >
      <RepeatIcon aria-label="Reposts" className="size-5" />
      {formatCompactCount((postView.repostCount ?? 0) + (postView.quoteCount ?? 0))}
    </button>
  );
}

function LikeButton({ postView }: { postView: app.bsky.feed.defs.PostView }): React.ReactElement {
  const [isLiked, toggleLike] = useLikeState(postView);

  return (
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
        (postView.likeCount ?? 0) - (postView.viewer?.like != null ? 1 : 0) + (isLiked ? 1 : 0),
      )}
    </button>
  );
}
