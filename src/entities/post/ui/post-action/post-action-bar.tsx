import { clsx } from "clsx";
import React from "react";

import type { app } from "#src/shared/api/lexicons/index.ts";
import { formatCompactCount } from "#src/shared/lib/format-compact-count.ts";
import { FavoriteFillIcon, FavoriteIcon, ReplyIcon } from "#src/shared/ui/icon/index.ts";

import { NewPostDialog } from "../new-post-dialog/new-post-dialog";
import { MoreActions } from "./more-actions";
import { RepostActions } from "./repost-actions";
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
        <RepostActions postView={postView} />
      </li>

      <li className="flex items-center gap-x-1">
        <LikeButton postView={postView} />
      </li>
    </ul>
  );
}

function ReplyButton({ postView }: { postView: app.bsky.feed.defs.PostView }): React.ReactElement {
  return (
    <NewPostDialog.Trigger
      className="relative -m-2 flex cursor-pointer items-center gap-x-1 p-2"
      payload={{ replyPostView: postView }}
    >
      <ReplyIcon aria-label="Replies" className="size-5" />
      {formatCompactCount(postView.replyCount ?? 0)}
    </NewPostDialog.Trigger>
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
        isLiked && "text-fg-like",
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
