import { Drawer } from "@base-ui/react";
import { clsx } from "clsx";
import React, { useState } from "react";

import type { app } from "#src/shared/api/lexicons/index.ts";
import {
  BookmarkFillIcon,
  BookmarkIcon,
  DeleteIcon,
  MoreHorizIcon,
} from "#src/shared/ui/icon/index.ts";

import { useBookmark } from "./use-bookmark-state";

export function MoreActionsDrawer({
  postView,
  isMine,
  onClickDelete,
}: {
  postView: app.bsky.feed.defs.PostView;
  isMine: boolean;
  onClickDelete: () => void;
}): React.ReactElement {
  const [isOpen, setIsOpen] = useState(false);

  const onClickToClose = () => {
    setIsOpen(false);
  };

  const onClickDeleteAndClose = () => {
    onClickDelete();
    setIsOpen(false);
  };

  return (
    <Drawer.Root open={isOpen} onOpenChange={setIsOpen}>
      <Drawer.Trigger
        className="relative -m-2 flex cursor-pointer items-center gap-x-1 p-2 text-fg-muted"
        render={(props) => <button type="button" {...props} />}
      >
        <MoreHorizIcon aria-label="More" className="size-5" />
      </Drawer.Trigger>

      <Drawer.Portal>
        <Drawer.Backdrop className="fixed inset-0 bg-backdrop/75 transition-opacity duration-300 data-ending-style:opacity-0 data-starting-style:opacity-0 data-swiping:duration-0" />
        <Drawer.Viewport className="fixed inset-0 flex items-end justify-center">
          <Drawer.Popup className="w-full transform-[translateY(var(--drawer-swipe-movement-y))] rounded-t-lg border-t border-highlight bg-filling px-4 backdrop-blur-sm transition-transform duration-300 data-ending-style:transform-[translateY(calc(100%+2px))] data-starting-style:transform-[translateY(calc(100%+2px))] data-swiping:select-none">
            <div className="mx-auto mt-3 h-1 w-10 rounded-full bg-fg-muted"></div>

            <Drawer.Content className="flex flex-col gap-1 py-4">
              <BookmarkButton postView={postView} onClick={onClickToClose} />
              {isMine && <DeleteButton onClick={onClickDeleteAndClose} />}
            </Drawer.Content>
          </Drawer.Popup>
        </Drawer.Viewport>
      </Drawer.Portal>
    </Drawer.Root>
  );
}

function BookmarkButton({
  postView,
  onClick: propOnClick,
}: {
  postView: app.bsky.feed.defs.PostView;
  onClick: () => void;
}): React.ReactElement {
  const { isSaved, save, unsave } = useBookmark(postView);
  const onClick = () => {
    (isSaved ? unsave : save)();
    propOnClick();
  };

  return (
    <button
      onClick={onClick}
      className={clsx(
        "flex w-full cursor-pointer items-center gap-2 rounded px-5 py-3 text-sm text-inherit hover:bg-highlight",
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
    </button>
  );
}

function DeleteButton({ onClick }: { onClick: () => void }): React.ReactElement {
  return (
    <button
      onClick={onClick}
      className="flex w-full cursor-pointer items-center gap-2 rounded px-5 py-3 text-sm text-fg-danger hover:bg-fill-danger"
    >
      <DeleteIcon className="size-5" />
      Delete
    </button>
  );
}
