import { RichText } from "@atproto/api";
import { Dialog } from "@base-ui/react";
import { useMutation } from "@tanstack/react-query";
import React, { useCallback, useEffect, useMemo, useState } from "react";

import { useInvalidateTimelineQuery } from "#src/entities/timeline/@x/post.ts";
import { useAssertSession } from "#src/shared/auth/index.ts";
import { AlertDialog } from "#src/shared/ui/alert-dialog.tsx";
import Card from "#src/shared/ui/card.tsx";
import { LoadingDotsIcon, SendIcon } from "#src/shared/ui/icon/index.ts";
import { NakedButton } from "#src/shared/ui/naked-button.tsx";

import { createPost } from "../api/create-post";
import { useExternalEmbedQuery } from "../api/external-embed-query";
import { ExternalEmbedUI } from "./embeds/external-embed-ui";

export function NewPostDialog({ trigger }: { trigger: React.ReactNode }): React.ReactElement {
  const session = useAssertSession();
  const invalidateTimelineQuery = useInvalidateTimelineQuery();

  const [text, setText] = useState("");
  const debouncedText = useDebouncedValue(text, 400);
  const firstEmbedLink = useMemo(() => getFirstEmbedLink(debouncedText), [debouncedText]);

  const { data: externalEmbedPreview, isLoading: isExternalEmbedPreviewLoading } =
    useExternalEmbedQuery(firstEmbedLink?.toString() ?? null);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);

  const onChangeOpen = useCallback((isOpen: boolean) => {
    // if (!isOpen) {
    //   if (text.trim().length > 0) {
    //     setIsConfirmationOpen(true);
    //     return;
    //   }
    // }

    setIsDialogOpen(isOpen);
  }, []);

  useEffect(() => {
    // Enables closing the dialog with the back gesture / button (Chromium-based browsers).
    if (!isDialogOpen || typeof CloseWatcher === "undefined") {
      return;
    }

    const closeWatcher = new CloseWatcher();
    closeWatcher.addEventListener("close", () => {
      onChangeOpen(false);
    });

    return () => {
      closeWatcher.destroy();
    };
  }, [isDialogOpen, onChangeOpen]);

  const {
    mutate: submitPost,
    isPending,
    error,
  } = useMutation({
    mutationFn: (text: string) => createPost(session, text),
    onSuccess: () => {
      setIsDialogOpen(false);
      setText("");
      void invalidateTimelineQuery();
    },
  });

  const onClickSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const trimmedText = text.trim();

    if (trimmedText.length == 0) {
      return;
    }

    submitPost(trimmedText);
  };

  return (
    <Dialog.Root open={isDialogOpen} onOpenChange={onChangeOpen}>
      {trigger}
      <Dialog.Portal className="relative z-50">
        <Dialog.Backdrop className="fixed inset-0 bg-backdrop/75" />
        <Dialog.Popup className="fixed inset-x-5 inset-y-4 data-nested-dialog-open:after:fixed data-nested-dialog-open:after:inset-0 data-nested-dialog-open:after:bg-backdrop/75">
          <div className="mx-auto w-full max-w-tablet">
            <Card>
              <div className="flex flex-col gap-4 px-5 py-4">
                <div className="flex justify-between gap-4">
                  <h2 className="font-bold">New post</h2>
                </div>

                <textarea
                  name="text"
                  placeholder="What's on your mind?"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="w-full bg-highlight px-3 py-2 inset-shadow-sm"
                />

                {firstEmbedLink &&
                  (isExternalEmbedPreviewLoading ? (
                    <div className="flex justify-center py-2">
                      <LoadingDotsIcon className="size-6 text-fg-muted" />
                    </div>
                  ) : (
                    externalEmbedPreview && (
                      <ExternalEmbedUI
                        embed={{
                          $type: "app.bsky.embed.external#view",
                          external: {
                            $type: "app.bsky.embed.external#viewExternal",
                            uri: externalEmbedPreview.uri,
                            title: externalEmbedPreview.title,
                            description: externalEmbedPreview.description,
                            thumb: externalEmbedPreview.thumb,
                          },
                        }}
                      />
                    )
                  ))}

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

            <AlertDialog
              open={isConfirmationOpen}
              onOpenChange={setIsConfirmationOpen}
              onConfirm={() => {
                setIsDialogOpen(false);
                setIsConfirmationOpen(false);
              }}
              title="ポストを破棄しますか？"
              description="入力中の内容は保存されません。"
              cancel="入力に戻る"
              confirm="破棄する"
              destructive
            />
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

NewPostDialog.Trigger = Dialog.Trigger;

function getFirstEmbedLink(text: string): URL | null {
  const rt = new RichText({ text });
  rt.detectFacetsWithoutResolution();

  for (const segment of rt.segments()) {
    if (segment.isLink()) {
      try {
        return new URL(segment.link?.uri ?? "");
      } catch {
        //
      }
    }
  }

  return null;
}

function useDebouncedValue<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
