import { Menu } from "@base-ui/react";
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

  const {
    isDialogOpen: isDeleteDialogOpen,
    setIsDialogOpen: setIsDeleteDialogOpen,
    onClick: onClickDelete,
    onConfirm: onConfirmDelete,
  } = useDelete(postView);

  const isMine = postView.author.did === session.did;

  return (
    <>
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
              <BookmarkItem postView={postView} />

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

function BookmarkItem({ postView }: { postView: app.bsky.feed.defs.PostView }): React.ReactElement {
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
