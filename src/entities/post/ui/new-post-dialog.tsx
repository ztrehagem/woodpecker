import { RichText } from "@atproto/api";
import { Dialog } from "@base-ui/react";
import { useMutation } from "@tanstack/react-query";
import React, { createContext, use, useEffect, useMemo, useRef, useState } from "react";

import { useInvalidateTimelineQuery } from "#src/entities/timeline/@x/post.ts";
import type { app } from "#src/shared/api/lexicons/index.ts";
import { useAssertSession } from "#src/shared/auth/index.ts";
import { useCloseWatcherEffect } from "#src/shared/lib/close-watcher.ts";
import Card from "#src/shared/ui/card.tsx";
import { LoadingDotsIcon, SendIcon } from "#src/shared/ui/icon/index.ts";
import { NakedButton } from "#src/shared/ui/naked-button.tsx";

import { createPost } from "../api/create-post";
import { type ExternalEmbedPreview, useExternalEmbedQuery } from "../api/external-embed-query";
import { ExternalEmbedUI } from "./embeds/external-embed-ui";

export function NewPostDialog(): React.ReactElement {
  const handle = use(HandleContext);

  const session = useAssertSession();
  const invalidateTimelineQuery = useInvalidateTimelineQuery();

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [text, setText] = useState("");
  const debouncedText = useDebouncedValue(text, 400);
  const firstEmbedLink = useMemo(() => getFirstEmbedLink(debouncedText), [debouncedText]);

  const { data: externalEmbedPreview, isLoading: isExternalEmbedPreviewLoading } =
    useExternalEmbedQuery(firstEmbedLink?.toString() ?? null);

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useCloseWatcherEffect(isDialogOpen, setIsDialogOpen);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) {
      return;
    }
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  }, [text, isDialogOpen]);

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

    submitPost({ text: trimmedText, embed: externalEmbedPreview });
  };

  const onKeyUp = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      submit();
    }
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

                  <textarea
                    ref={textareaRef}
                    name="text"
                    placeholder="What's on your mind?"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyUp={onKeyUp}
                    rows={3}
                    className="max-h-[40svh] w-full resize-none border-b border-white px-3 py-2"
                  />

                  {firstEmbedLink &&
                    (isExternalEmbedPreviewLoading ? (
                      <div className="flex justify-center py-2">
                        <LoadingDotsIcon className="size-6 text-fg-muted" />
                      </div>
                    ) : (
                      externalEmbedPreview && (
                        <ExternalEmbedUI embed={toEmbedExternalView(externalEmbedPreview)} />
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

function toEmbedExternalView(preview: ExternalEmbedPreview): app.bsky.embed.external.View {
  return {
    $type: "app.bsky.embed.external#view",
    external: {
      $type: "app.bsky.embed.external#viewExternal",
      uri: preview.uri,
      title: preview.title,
      description: preview.description,
      thumb: preview.thumb,
    },
  };
}

function useDebouncedValue<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
