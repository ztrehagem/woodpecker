import { Dialog } from "@base-ui/react";
import { useMutation } from "@tanstack/react-query";
import React, { createContext, use, useState } from "react";

import { useInvalidateTimelineQuery } from "#src/entities/timeline/@x/post.ts";
import { useAssertSession } from "#src/shared/auth/index.ts";
import { useCloseWatcherEffect } from "#src/shared/lib/close-watcher.ts";
import Card from "#src/shared/ui/card.tsx";
import { SendIcon } from "#src/shared/ui/icon/index.ts";
import { NakedButton } from "#src/shared/ui/naked-button.tsx";

import { createPost } from "../../api/create-post";
import { type ExternalEmbedPreview } from "../../api/external-embed-query";
import { ExternalEmbedPreview as ExternalEmbedPreviewComponent } from "./external-embed-preview";
import { Textarea } from "./textarea";
import { useExternalEmbedPreview } from "./use-external-embed-preview";

export function NewPostDialog(): React.ReactElement {
  const handle = use(HandleContext);

  const session = useAssertSession();
  const invalidateTimelineQuery = useInvalidateTimelineQuery();

  const [text, setText] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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

  const submit = () => {
    const trimmedText = text.trim();

    if (trimmedText.length == 0) {
      return;
    }

    submitPost({ text: trimmedText, embed: externalEmbedPreviewProps.preview });
  };

  const onClickSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    submit();
  };

  return (
    <Dialog.Root open={isDialogOpen} onOpenChange={setIsDialogOpen} handle={handle}>
      <Dialog.Portal className="relative z-50">
        <Dialog.Backdrop className="fixed inset-0 bg-backdrop/75" />
        <Dialog.Viewport className="group/dialog fixed inset-0 overflow-y-auto overscroll-contain">
          <Dialog.Popup className="relative mx-5 my-4 data-nested-dialog-open:after:fixed data-nested-dialog-open:after:inset-0 data-nested-dialog-open:after:bg-backdrop/75">
            <div className="mx-auto w-full max-w-xl">
              <Card>
                <div className="flex flex-col gap-4 px-5 py-4">
                  <div className="flex justify-between gap-4">
                    <h2 className="font-bold">New post</h2>
                  </div>

                  <Textarea
                    text={text}
                    onChange={(e) => setText(e.target.value)}
                    onSubmitIntent={submit}
                  />

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
                      disabled={isPending}
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
    </Dialog.Root>
  );
}

const HandleContext = createContext(Dialog.createHandle());

function Trigger(props: React.ComponentProps<typeof Dialog.Trigger>): React.ReactElement {
  const handle = use(HandleContext);

  return <Dialog.Trigger {...props} handle={handle} />;
}

NewPostDialog.Trigger = Trigger;
