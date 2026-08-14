import { Menu } from "@base-ui/react";
import { clsx } from "clsx";
import React from "react";

import type { app } from "#src/shared/api/lexicons/index.ts";
import {
  BookmarkFillIcon,
  BookmarkIcon,
  DeleteIcon,
  MoreHorizIcon,
} from "#src/shared/ui/icon/index.ts";

import { useBookmark } from "./use-bookmark-state";

export function MoreActionsMenu({
  postView,
  isMine,
  onClickDelete,
}: {
  postView: app.bsky.feed.defs.PostView;
  isMine: boolean;
  onClickDelete: () => void;
}): React.ReactElement {
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
            <BookmarkMenuItem postView={postView} />
            {isMine && <DeleteMenuItem onClick={onClickDelete} />}
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
}

function BookmarkMenuItem({
  postView,
}: {
  postView: app.bsky.feed.defs.PostView;
}): React.ReactElement {
  const { isSaved, save, unsave } = useBookmark(postView);
  const onClick = isSaved ? unsave : save;

  return (
    <Menu.Item
      onClick={onClick}
      className={clsx(
        "flex cursor-pointer items-center gap-2 px-5 py-2 text-sm text-inherit hover:bg-highlight",
      )}
    >
      {isSaved ? (
        <>
          <BookmarkFillIcon className="size-5 text-fg-link" />
          Saved
        </>
      ) : (
        <>
          <BookmarkIcon className="size-5" />
          Save
        </>
      )}
    </Menu.Item>
  );
}

function DeleteMenuItem({ onClick }: { onClick: () => void }): React.ReactElement {
  return (
    <Menu.Item
      onClick={onClick}
      className={clsx(
        "flex cursor-pointer items-center gap-2 px-5 py-2 text-sm text-fg-danger hover:bg-fill-danger",
      )}
    >
      <DeleteIcon className="size-5" />
      Delete
    </Menu.Item>
  );
}
