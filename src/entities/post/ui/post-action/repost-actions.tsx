import { Toast } from "@base-ui/react";
import { useMutation } from "@tanstack/react-query";
import clsx from "clsx";
import React, { use, useState } from "react";

import type { app } from "#src/shared/api/lexicons/index.ts";
import { useAssertSession } from "#src/shared/auth/index.ts";
import { ActionMenu } from "#src/shared/ui/action-menu/index.ts";
import { AlertDialog } from "#src/shared/ui/alert-dialog.tsx";
import { QuoteIcon, RepeatIcon } from "#src/shared/ui/icon/index.ts";

import { repostPost } from "../../api/repost-post";
import { useInvalidateTimelineQuery } from "../../api/timeline-query";
import { formatCompactCount } from "../../lib/format-compact-count";
import { NewPostDialogContext } from "../new-post-dialog/new-post-dialog-context";

export function RepostActions({
  postView,
}: {
  postView: app.bsky.feed.defs.PostView;
}): React.ReactElement {
  const session = useAssertSession();
  const toastManager = Toast.useToastManager();
  const invalidateTimelineQuery = useInvalidateTimelineQuery();
  const newPostDialogHandle = use(NewPostDialogContext);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);

  const { mutateAsync: repost } = useMutation({
    mutationFn: () => repostPost(session, postView),
    onSuccess: () => {
      toastManager.add({ title: "Reposted" });
      void invalidateTimelineQuery();
    },
  });

  const isReposted = postView.viewer?.repost != null;

  const onConfirmRepost = async () => {
    await repost();
    setIsConfirmationOpen(false);
  };

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
        <ActionMenu.Item onClick={() => setIsConfirmationOpen(true)}>
          <RepeatIcon className="size-5" />
          Repost
        </ActionMenu.Item>

        <ActionMenu.Item onClick={onClickQuote}>
          <QuoteIcon className="size-5" />
          Quote
        </ActionMenu.Item>
      </ActionMenu>

      <AlertDialog
        open={isConfirmationOpen}
        onOpenChange={setIsConfirmationOpen}
        onConfirm={onConfirmRepost}
        title="Repost"
        description="Are you sure you want to repost this post?"
        cancel="Cancel"
        confirm="Repost"
      />
    </>
  );
}
