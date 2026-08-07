import { Dialog } from "@base-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";
import React, { useState } from "react";

import { timelineQueryKeys } from "#src/entities/timeline/index.ts";
import { useAssertSession } from "#src/shared/auth/index.ts";
import { AlertDialog } from "#src/shared/ui/alert-dialog.tsx";
import Card from "#src/shared/ui/card.tsx";
import { LoadingDotsIcon, SendIcon } from "#src/shared/ui/icon/index.ts";

import { createPost } from "../api/create-post";

export function NewPostDialog({ trigger }: { trigger: React.ReactNode }): React.ReactElement {
  const session = useAssertSession();
  const queryClient = useQueryClient();

  const [text, setText] = useState("");

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);

  const onChangeOpen = (isOpen: boolean) => {
    // if (!isOpen) {
    //   if (text.trim().length > 0) {
    //     setIsConfirmationOpen(true);
    //     return;
    //   }
    // }

    setIsDialogOpen(isOpen);
  };

  const {
    mutate: submitPost,
    isPending,
    error,
  } = useMutation({
    mutationFn: (text: string) => createPost(session, text),
    onSuccess: () => {
      setIsDialogOpen(false);
      setText("");
      void queryClient.invalidateQueries({ queryKey: timelineQueryKeys.all });
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
                  <h2 className="font-bold">ポスト</h2>

                  <Dialog.Close
                    className="cursor-pointer text-link active:text-link-active"
                    render={(props) => <button type="button" {...props} />}
                  >
                    キャンセル
                  </Dialog.Close>
                </div>

                <textarea
                  name="text"
                  placeholder="最近どう？"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="w-full bg-highlight px-3 py-2 inset-shadow-sm"
                />

                {error && <p className="text-danger">{error.message}</p>}

                <button
                  type="button"
                  onClick={onClickSubmit}
                  disabled={isPending}
                  className="relative cursor-pointer self-end font-bold text-link active:text-link-active"
                >
                  <span className={clsx("flex items-center gap-2", isPending && "invisible")}>
                    送信
                    <SendIcon />
                  </span>
                  {isPending && (
                    <LoadingDotsIcon className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                  )}
                </button>
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
