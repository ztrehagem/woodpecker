import React from "react";

import type { app } from "#src/shared/api/lexicons/index.ts";
import { useAssertSession } from "#src/shared/auth/index.ts";
import { AlertDialog } from "#src/shared/ui/alert-dialog.tsx";

import { MoreActionsDrawer } from "./more-actions-drawer";
import { MoreActionsMenu } from "./more-actions-menu";
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
      <div className="tablet:hidden">
        <MoreActionsDrawer postView={postView} isMine={isMine} onClickDelete={onClickDelete} />
      </div>

      <div className="max-tablet:hidden">
        <MoreActionsMenu postView={postView} isMine={isMine} onClickDelete={onClickDelete} />
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
