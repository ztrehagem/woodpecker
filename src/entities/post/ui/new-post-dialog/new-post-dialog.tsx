import { Dialog } from "@base-ui/react";
import { useMutation } from "@tanstack/react-query";
import React, { use, useState } from "react";

import { useAssertSession } from "#src/shared/auth/index.ts";
import { useCloseWatcherEffect } from "#src/shared/lib/close-watcher.ts";
import Card from "#src/shared/ui/card.tsx";
import { SendIcon } from "#src/shared/ui/icon/index.ts";
import { NakedButton } from "#src/shared/ui/naked-button.tsx";

import { createPost } from "../../api/create-post";
import { type ExternalEmbedPreview } from "../../api/external-embed-query";
import { useInvalidateTimelineQuery } from "../../api/timeline-query";
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

  const session = useAssertSession();
  const invalidateTimelineQuery = useInvalidateTimelineQuery();

  const [text, setText] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const graphemesCount = useGraphemesCount(text);
  const externalEmbedPreviewProps = useExternalEmbedPreview(text);

  useCloseWatcherEffect(isDialogOpen, setIsDialogOpen);

  const {
    mutate: submitPost,
    isPending,
    error,
  } = useMutation({
    mutationFn: ({ text, embed }: { text: string; embed: ExternalEmbedPreview | undefined }) =>
      createPost(session, text, embed),
    onSuccess: () => {
      setIsDialogOpen(false);
      setText("");
      void invalidateTimelineQuery();
    },
  });

  const trimmedText = text.trim();
  const canSubmit = !isPending && graphemesCount <= 300 && trimmedText.length > 0;

  const submit = () => {
    if (!canSubmit) {
      return;
    }

    submitPost({ text: trimmedText, embed: externalEmbedPreviewProps.preview });
  };

  const onClickSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    submit();
  };

  return (
    <Dialog.Root<NewPostDialogPayload>
      open={isDialogOpen}
      onOpenChange={setIsDialogOpen}
      handle={handle}
    >
      {({ payload }) => (
        <Dialog.Portal className="relative z-50">
          <Dialog.Backdrop className="fixed inset-0 bg-backdrop/75" />
          <Dialog.Viewport className="group/dialog fixed inset-0 overflow-y-auto overscroll-contain">
            <Dialog.Popup className="relative mx-5 my-4 data-nested-dialog-open:after:fixed data-nested-dialog-open:after:inset-0 data-nested-dialog-open:after:bg-backdrop/75">
              <div className="mx-auto w-full max-w-xl">
                <Card>
                  <div className="flex flex-col gap-4 px-5 py-4">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <Dialog.Title className="font-bold">New post</Dialog.Title>

                      <ProfileView />
                    </div>

                    {payload?.replyPostView && (
                      <pre className="text-2xs">
                        {JSON.stringify(payload.replyPostView.record, null, 2)}
                      </pre>
                    )}

                    <div className="flex flex-col gap-1">
                      <Textarea
                        text={text}
                        onChange={(e) => setText(e.target.value)}
                        onSubmitIntent={submit}
                      />

                      <div className="self-end">
                        <GraphemesCounter count={graphemesCount} />
                      </div>
                    </div>

                    <ExternalEmbedPreviewComponent {...externalEmbedPreviewProps} />

                    {error && <p className="text-fg-danger">{error.message}</p>}

                    <div className="-mx-2 flex justify-between gap-4">
                      <Dialog.Close
                        render={(props) => <NakedButton severity="destructive" {...props} />}
                      >
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
              </div>
            </Dialog.Popup>
          </Dialog.Viewport>
        </Dialog.Portal>
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
