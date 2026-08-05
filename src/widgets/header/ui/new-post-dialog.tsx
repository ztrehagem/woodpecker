import { Dialog, AlertDialog } from "@base-ui/react";
import clsx from "clsx";
import React, { useActionState, useRef, useState } from "react";

import { useCachedClient } from "#src/features/auth/index.ts";
import Card from "#src/shared/ui/card.tsx";
import { LoadingDotsIcon, SendIcon } from "#src/shared/ui/icon/index.ts";

export function NewPostDialog({ trigger }: { trigger: React.ReactNode }): React.ReactElement {
  const client = useCachedClient();

  const formRef = useRef<HTMLFormElement>(null);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = React.useState(false);

  const onChangeOpen = (isOpen: boolean) => {
    if (!isOpen) {
      const fd = new FormData(formRef.current!);
      const text = (fd.get("text") as string).trim();

      if (text.length > 0) {
        setIsConfirmationOpen(true);
        return;
      }
    }

    setIsDialogOpen(isOpen);
  };

  const [error, dispatch, isPending] = useActionState<Error | null, FormData>(
    async (_, fd: FormData) => {
      const text = (fd.get("text") as string).trim();

      if (text.length == 0) {
        return null;
      }

      try {
        await client.createPost(text);
        setIsDialogOpen(false);
      } catch (error) {
        return error instanceof Error ? error : new Error("Unknown error", { cause: error });
      }

      return null;
    },
    null,
  );

  return (
    <Dialog.Root open={isDialogOpen} onOpenChange={onChangeOpen}>
      {trigger}
      <Dialog.Portal className="relative z-50">
        <Dialog.Backdrop className="fixed inset-0 bg-backdrop/50" />
        <Dialog.Popup className="fixed inset-x-5 inset-y-4 data-nested-dialog-open:after:fixed data-nested-dialog-open:after:inset-0 data-nested-dialog-open:after:bg-backdrop/50">
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

                <form
                  ref={formRef}
                  noValidate
                  name="new-post"
                  action={dispatch}
                  className="flex flex-col gap-4"
                >
                  <textarea
                    name="text"
                    placeholder="最近どう？"
                    className="w-full bg-highlight px-3 py-2 inset-shadow-sm"
                  />

                  {error && <p className="text-danger">{error.message}</p>}

                  <button
                    type="submit"
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
                </form>
              </div>
            </Card>

            <ConfirmationDialog
              open={isConfirmationOpen}
              onOpenChange={setIsConfirmationOpen}
              onConfirm={() => {
                setIsDialogOpen(false);
                setIsConfirmationOpen(false);
              }}
            />
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

NewPostDialog.Trigger = Dialog.Trigger;

function ConfirmationDialog({
  open,
  onOpenChange,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}): React.ReactElement {
  return (
    <AlertDialog.Root open={open} onOpenChange={onOpenChange}>
      <AlertDialog.Portal className="relative z-50">
        <AlertDialog.Popup className="fixed top-[calc(50%+1.25rem*var(--nested-dialogs))] left-1/2 -mt-8 flex w-96 max-w-[calc(100vw-3rem)] -translate-x-1/2 -translate-y-1/2 scale-[calc(1-0.1*var(--nested-dialogs))] flex-col gap-4">
          <Card>
            <div className="flex flex-col gap-4 px-5 py-4">
              <div className="flex flex-col gap-1">
                <AlertDialog.Title className="text-base font-bold">
                  ポストを破棄しますか？
                </AlertDialog.Title>
                <AlertDialog.Description className="text-sm text-neutral-600 dark:text-neutral-400">
                  入力中の内容は保存されません。
                </AlertDialog.Description>
              </div>
              <div className="flex justify-end gap-3">
                <AlertDialog.Close className="flex h-8 cursor-pointer items-center justify-center gap-2 px-3 text-sm leading-none font-normal whitespace-nowrap text-link select-none active:text-link-active">
                  入力に戻る
                </AlertDialog.Close>
                <button
                  type="button"
                  className="flex h-8 cursor-pointer items-center justify-center gap-2 px-3 text-sm leading-none font-bold whitespace-nowrap text-danger select-none active:text-danger-active"
                  onClick={() => {
                    onOpenChange(false);
                    onConfirm();
                  }}
                >
                  破棄する
                </button>
              </div>
            </div>
          </Card>
        </AlertDialog.Popup>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
