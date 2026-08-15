import { Dialog } from "@base-ui/react";
import { useMutation } from "@tanstack/react-query";
import React, { use, useState } from "react";

import type { app } from "#src/shared/api/lexicons/index.ts";
import { useAssertSession } from "#src/shared/auth/index.ts";
import { useCloseWatcherEffect } from "#src/shared/lib/close-watcher.ts";
import { AlertDialog } from "#src/shared/ui/alert-dialog.tsx";
import Card from "#src/shared/ui/card.tsx";
import { SendIcon } from "#src/shared/ui/icon/index.ts";
import { NakedButton } from "#src/shared/ui/naked-button.tsx";

import { createPost } from "../../api/create-post";
import { type ExternalEmbedPreview } from "../../api/external-embed-query";
import { useInvalidateTimelineQuery } from "../../api/timeline-query";
import { isPostRecord } from "../../lib/is-post-record";
import { PostPreviewCard } from "../post-preview-card";
import { ExternalEmbedPreview as ExternalEmbedPreviewComponent } from "./external-embed-preview";
import { GraphemesCounter } from "./graphemes-counter";
import { NewPostDialogContext } from "./new-post-dialog-context";
import type { NewPostDialogPayload } from "./new-post-dialog-payload";
import { ProfileView } from "./profile-view";
import { Textarea } from "./textarea";
import { useExternalEmbedPreview } from "./use-external-embed-preview";
import { useGraphemesCount } from "./use-graphemes-count";

export function NewPostDialog(): React.ReactElement {
  const handle = use(NewPostDialogContext);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [text, setText] = useState("");

  useCloseWatcherEffect(isDialogOpen, setIsDialogOpen);

  const onOpenChange = (isOpen: boolean) => {
    if (!isOpen && text.length > 0) {
      setIsConfirmationOpen(true);
    } else {
      setText("");
      setIsDialogOpen(isOpen);
    }
  };

  const onConfirmDiscard = () => {
    setIsConfirmationOpen(false);
    setIsDialogOpen(false);
  };

  return (
    <Dialog.Root<NewPostDialogPayload>
      open={isDialogOpen}
      onOpenChange={onOpenChange}
      handle={handle}
    >
      {({ payload }) => (
        <>
          <Dialog.Portal className="relative z-50">
            <Dialog.Backdrop className="fixed inset-0 bg-backdrop/75" />
            <Dialog.Viewport className="group/dialog fixed inset-0 overflow-y-auto overscroll-contain">
              <Dialog.Popup className="relative mx-5 my-4 data-nested-dialog-open:after:fixed data-nested-dialog-open:after:inset-0 data-nested-dialog-open:after:bg-backdrop/75">
                <div className="mx-auto w-full max-w-xl">
                  <NewPostDialogCard
                    text={text}
                    onTextChange={setText}
                    setIsDialogOpen={setIsDialogOpen}
                    payload={payload}
                  />
                </div>
              </Dialog.Popup>
            </Dialog.Viewport>
          </Dialog.Portal>

          <AlertDialog
            open={isConfirmationOpen}
            onOpenChange={setIsConfirmationOpen}
            title="Discard post?"
            description="Are you sure you want to discard this post? This action cannot be undone."
            destructive
            confirm="Discard"
            cancel="Cancel"
            onConfirm={onConfirmDiscard}
          />
        </>
      )}
    </Dialog.Root>
  );
}

function Trigger(
  props: React.ComponentProps<typeof Dialog.Trigger<NewPostDialogPayload>>,
): React.ReactElement {
  const handle = use(NewPostDialogContext);

  return <Dialog.Trigger {...props} handle={handle} />;
}

NewPostDialog.Trigger = Trigger;

function NewPostDialogCard({
  text,
  onTextChange,
  setIsDialogOpen,
  payload,
}: {
  text: string;
  onTextChange: (text: string) => void;
  setIsDialogOpen: (isOpen: boolean) => void;
  payload: NewPostDialogPayload;
}): React.ReactElement {
  const session = useAssertSession();
  const invalidateTimelineQuery = useInvalidateTimelineQuery();
  const graphemesCount = useGraphemesCount(text);
  const externalEmbedPreviewProps = useExternalEmbedPreview(text);

  const {
    mutate: submitPost,
    isPending,
    error,
  } = useMutation({
    mutationFn: ({
      text,
      externalEmbed,
    }: {
      text: string;
      externalEmbed: ExternalEmbedPreview | undefined;
    }) => {
      const reply = payload?.replyPostView ? buildReplyRefAssert(payload.replyPostView) : void 0;
      return createPost(session, { text, reply, externalEmbed });
    },
    onSuccess: () => {
      setIsDialogOpen(false);
      void invalidateTimelineQuery();
    },
  });

  const onChangeTextarea = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onTextChange(e.target.value);
  };

  const trimmedText = text.trim();
  const canSubmit = !isPending && graphemesCount <= 300 && trimmedText.length > 0;

  const submit = () => {
    if (canSubmit) {
      submitPost({ text, externalEmbed: externalEmbedPreviewProps.preview });
    }
  };

  const onClickSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    submit();
  };

  return (
    <Card>
      <div className="flex flex-col gap-4 px-5 py-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <Dialog.Title className="font-bold">
            {payload?.replyPostView ? "Replying to post" : "New post"}
          </Dialog.Title>

          <ProfileView />
        </div>

        {payload?.replyPostView && <PostPreviewCard postView={payload.replyPostView} />}

        <div className="flex flex-col gap-1">
          <Textarea text={text} onChange={onChangeTextarea} onSubmitIntent={submit} />

          <div className="self-end">
            <GraphemesCounter count={graphemesCount} />
          </div>
        </div>

        <ExternalEmbedPreviewComponent {...externalEmbedPreviewProps} />

        {error && <p className="text-fg-danger">{error.message}</p>}

        <div className="-mx-2 flex justify-between gap-4">
          <Dialog.Close render={(props) => <NakedButton severity="destructive" {...props} />}>
            Cancel
          </Dialog.Close>

          <NakedButton
            onClick={onClickSubmit}
            disabled={!canSubmit}
            severity="primary"
            emphasize
            processing={isPending}
          >
            Send
            <SendIcon />
          </NakedButton>
        </div>
      </div>
    </Card>
  );
}

function buildReplyRefAssert(postView: app.bsky.feed.defs.PostView): app.bsky.feed.post.ReplyRef {
  const record = postView.record;

  if (!isPostRecord(record)) {
    throw new Error("record is not a post");
  }

  return {
    root: record.reply?.root ?? {
      uri: postView.uri,
      cid: postView.cid,
    },
    parent: {
      uri: postView.uri,
      cid: postView.cid,
    },
  };
}
