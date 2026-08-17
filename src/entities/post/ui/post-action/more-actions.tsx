import React from "react";

import type { app } from "#src/shared/api/lexicons/index.ts";
import { useAssertSession } from "#src/shared/auth/index.ts";
import { ActionMenu } from "#src/shared/ui/action-menu/index.ts";
import { AlertDialog } from "#src/shared/ui/alert-dialog.tsx";
import {
  BookmarkFillIcon,
  BookmarkIcon,
  DeleteIcon,
  MoreHorizIcon,
} from "#src/shared/ui/icon/index.ts";

import { useBookmark } from "./use-bookmark-state";
import { useDelete } from "./use-delete";

export function MoreActions({
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
      <ActionMenu
        trigger={
          <ActionMenu.Trigger className="relative -m-2 flex cursor-pointer items-center gap-x-1 p-2 text-fg-muted">
            <MoreHorizIcon aria-label="More" className="size-5" />
          </ActionMenu.Trigger>
        }
      >
        <BookmarkItem postView={postView} />

        {isMine && (
          <ActionMenu.Item destructive onClick={onClickDelete}>
            <DeleteIcon className="size-5" />
            Delete
          </ActionMenu.Item>
        )}
      </ActionMenu>

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
    <ActionMenu.Item onClick={onClick}>
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
    </ActionMenu.Item>
  );
}
