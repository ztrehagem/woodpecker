import { AlertDialog as Lib } from "@base-ui/react";
import React, { useEffect, useState } from "react";

import Card from "./card";
import { NakedButton } from "./naked-button";

export function AlertDialog({
  open,
  onOpenChange,
  onConfirm,
  title,
  description,
  cancel,
  confirm,
  destructive = false,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<void> | void;
  title: React.ReactNode;
  description?: React.ReactNode;
  cancel: React.ReactNode;
  confirm: React.ReactNode;
  destructive?: boolean;
}): React.ReactElement {
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!open || typeof CloseWatcher === "undefined") {
      return;
    }

    const closeWatcher = new CloseWatcher();
    closeWatcher.addEventListener("close", () => {
      onOpenChange(false);
    });

    return () => {
      closeWatcher.destroy();
    };
  }, [open, onOpenChange]);

  const onClickConfirm = () => {
    const maybePromise = onConfirm();

    if (maybePromise instanceof Promise) {
      setIsProcessing(true);
      maybePromise
        .catch(() => {})
        .finally(() => {
          setIsProcessing(false);
          onOpenChange(false);
        });
    } else {
      onOpenChange(false);
    }
  };

  return (
    <Lib.Root open={open} onOpenChange={onOpenChange}>
      <Lib.Portal className="relative z-50">
        <Lib.Backdrop className="fixed inset-0 bg-backdrop/75" />
        <Lib.Popup className="fixed top-[calc(50%+1.25rem*var(--nested-dialogs))] left-1/2 -mt-8 flex w-96 max-w-[calc(100vw-3rem)] -translate-x-1/2 -translate-y-1/2 scale-[calc(1-0.1*var(--nested-dialogs))] flex-col gap-4">
          <Card>
            <div className="flex flex-col gap-4 px-5 py-4">
              <div className="flex flex-col gap-1">
                <Lib.Title className="text-base font-bold">{title}</Lib.Title>
                {description != null && (
                  <Lib.Description className="text-sm text-neutral-600 dark:text-neutral-400">
                    {description}
                  </Lib.Description>
                )}
              </div>
              <div className="flex justify-end gap-3">
                <Lib.Close
                  disabled={isProcessing}
                  className="flex h-8 cursor-pointer items-center justify-center gap-2 px-3 text-sm leading-none font-normal whitespace-nowrap text-link select-none active:text-link-active"
                  render={(props) => <NakedButton {...props} />}
                >
                  {cancel}
                </Lib.Close>
                <NakedButton
                  severity={destructive ? "destructive" : "primary"}
                  emphasize
                  processing={isProcessing}
                  disabled={isProcessing}
                  onClick={onClickConfirm}
                >
                  {confirm}
                </NakedButton>
              </div>
            </div>
          </Card>
        </Lib.Popup>
      </Lib.Portal>
    </Lib.Root>
  );
}
