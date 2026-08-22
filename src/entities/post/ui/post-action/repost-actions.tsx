import clsx from "clsx";
import React, { use } from "react";

import type { app } from "#src/shared/api/lexicons/index.ts";
import { formatCompactCount } from "#src/shared/lib/format-compact-count.ts";
import { ActionMenu } from "#src/shared/ui/action-menu/index.ts";
import { QuoteIcon, RepeatIcon } from "#src/shared/ui/icon/index.ts";

import type { Via } from "../../model/via";
import { NewPostDialogContext } from "../new-post-dialog/new-post-dialog-context";
import { useRepostState } from "./use-repost-state";

export function RepostActions({
  postView,
  via,
}: {
  postView: app.bsky.feed.defs.PostView;
  via?: Via;
}): React.ReactElement {
  const newPostDialogHandle = use(NewPostDialogContext);
  const [isReposted, toggleRepost] = useRepostState(postView, via);

  const onClickQuote = () => {
    newPostDialogHandle.openWithPayload({ quotePostView: postView });
  };

  return (
    <>
      <ActionMenu
        trigger={
          <ActionMenu.Trigger
            className={clsx(
              "relative -m-2 flex cursor-pointer items-center gap-x-1 p-2",
              isReposted && "text-fg-repost",
            )}
          >
            <RepeatIcon aria-label="Reposts" className="size-5" />
            {formatCompactCount((postView.repostCount ?? 0) + (postView.quoteCount ?? 0))}
          </ActionMenu.Trigger>
        }
      >
        <ActionMenu.Item onClick={toggleRepost}>
          <RepeatIcon className="size-5" />
          {isReposted ? "Undo repost" : "Repost"}
        </ActionMenu.Item>

        <ActionMenu.Item onClick={onClickQuote}>
          <QuoteIcon className="size-5" />
          Quote post
        </ActionMenu.Item>
      </ActionMenu>
    </>
  );
}
