import { Drawer, Menu } from "@base-ui/react";
import { clsx } from "clsx";
import React from "react";

import type { app } from "#src/shared/api/lexicons/index.ts";
import { useAssertSession } from "#src/shared/auth/index.ts";
import { AlertDialog } from "#src/shared/ui/alert-dialog.tsx";
import {
  BookmarkFillIcon,
  BookmarkIcon,
  DeleteIcon,
  MoreHorizIcon,
} from "#src/shared/ui/icon/index.ts";

import { useBookmark } from "./use-bookmark-state";
import { useDelete } from "./use-delete";

export function MoreMenu({
  postView,
}: {
  postView: app.bsky.feed.defs.PostView;
}): React.ReactElement {
  const session = useAssertSession();
  const isMine = postView.author.did === session.did;

  const {
    isDialogOpen: isDeleteDialogOpen,
    setIsDialogOpen: setIsDeleteDialogOpen,
    onClick: onClickDelete,
    onConfirm: onConfirmDelete,
  } = useDelete(postView);

  return (
    <>
      <div className="tablet:hidden">
        <MoreMenuDrawer postView={postView} isMine={isMine} onClickDelete={onClickDelete} />
      </div>

      <div className="max-tablet:hidden">
        <MoreMenuMenu postView={postView} isMine={isMine} onClickDelete={onClickDelete} />
      </div>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={onConfirmDelete}
        title="Delete Post"
        description="Are you sure you want to delete this post? This action cannot be undone."
        cancel="Cancel"
        confirm="Delete"
        destructive
      />
    </>
  );
}

interface MoreMenuViewProps {
  postView: app.bsky.feed.defs.PostView;
  isMine: boolean;
  onClickDelete: () => void;
}

function MoreMenuDrawer({
  postView,
  isMine,
  onClickDelete,
}: MoreMenuViewProps): React.ReactElement {
  return (
    <Drawer.Root>
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
              <BookmarkButton postView={postView} />

              {isMine && (
                <button
                  onClick={onClickDelete}
                  className="flex w-full cursor-pointer items-center gap-2 rounded px-5 py-3 text-sm text-fg-danger hover:bg-fill-danger"
                >
                  <DeleteIcon className="size-5" />
                  Delete
                </button>
              )}
            </Drawer.Content>
          </Drawer.Popup>
        </Drawer.Viewport>
      </Drawer.Portal>
    </Drawer.Root>
  );
}

function MoreMenuMenu({ postView, isMine, onClickDelete }: MoreMenuViewProps): React.ReactElement {
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

            {isMine && (
              <Menu.Item
                onClick={onClickDelete}
                className={clsx(
                  "flex cursor-pointer items-center gap-2 px-5 py-2 text-sm text-fg-danger hover:bg-fill-danger",
                )}
              >
                <DeleteIcon className="size-5" />
                Delete
              </Menu.Item>
            )}
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
}

interface BookmarkProps {
  postView: app.bsky.feed.defs.PostView;
}

function BookmarkButton({ postView }: BookmarkProps): React.ReactElement {
  const { isSaved, save, unsave } = useBookmark(postView);
  const onClick = isSaved ? unsave : save;

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

function BookmarkMenuItem({ postView }: BookmarkProps): React.ReactElement {
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
