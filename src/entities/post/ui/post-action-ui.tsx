import { Menu } from "@base-ui/react";
import { clsx } from "clsx";
import React from "react";

import type { app } from "#src/shared/api/lexicons/index.ts";
import { LikeIcon, MoreHorizIcon, RepeatIcon, ReplyIcon } from "#src/shared/ui/icon/index.ts";

export function PostActionUI({
  postView,
}: {
  postView: app.bsky.feed.defs.PostView;
}): React.ReactElement {
  return (
    <div className="mt-1 flex items-center justify-between gap-4">
      <ul className="grid grow grid-cols-3 gap-x-4 gap-y-1 text-sm font-light text-fg-muted">
        <li className="flex items-center gap-x-1">
          <button
            type="button"
            className="relative flex cursor-pointer items-center gap-x-1 text-fg-muted"
          >
            <ReplyIcon aria-label="Replies" className="size-4" />
            {postView.replyCount ?? 0}
          </button>
        </li>

        <li className="flex items-center gap-x-1">
          <button
            type="button"
            className="relative flex cursor-pointer items-center gap-x-1 text-fg-muted"
          >
            <RepeatIcon aria-label="Reposts" className="size-4" />
            {(postView.repostCount ?? 0) + (postView.quoteCount ?? 0)}
          </button>
        </li>

        <li className="flex items-center gap-x-1">
          <button
            type="button"
            className="relative flex cursor-pointer items-center gap-x-1 text-fg-muted"
          >
            <LikeIcon aria-label="Likes" className="size-4" />
            {postView.likeCount ?? 0}
          </button>
        </li>
      </ul>

      <MoreMenu />
    </div>
  );
}

function MoreMenu(): React.ReactElement {
  const itemClassName = clsx(
    "flex cursor-pointer items-center gap-2 px-5 py-1 text-inherit hover:bg-highlight",
  );

  return (
    <Menu.Root>
      <Menu.Trigger
        className="relative flex cursor-pointer items-center gap-x-1 text-fg-muted"
        render={(props) => <button type="button" {...props} />}
      >
        <MoreHorizIcon aria-label="More" className="size-4" />
      </Menu.Trigger>

      <Menu.Portal className="relative z-50">
        <Menu.Positioner side="bottom" sideOffset={8} align="end">
          <Menu.Popup className="relative rounded-md border bg-filling/75 py-2 shadow-2xl backdrop-blur-sm">
            <Menu.Item className={itemClassName}>Coming soon</Menu.Item>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
}
