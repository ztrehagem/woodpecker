import { Toast, type ToastObject } from "@base-ui/react/toast";
import clsx from "clsx";
import type React from "react";

import css from "./toast.module.css";

export function ToastRenderer(): React.ReactElement {
  return (
    <Toast.Portal className="relative z-100">
      <Toast.Viewport className="fixed inset-x-0 top-15 mx-auto w-full max-w-column-main">
        <ToastList />
      </Toast.Viewport>
    </Toast.Portal>
  );
}

function ToastList(): React.ReactElement {
  const { toasts } = Toast.useToastManager();

  return (
    <>
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </>
  );
}

function ToastItem({ toast }: { toast: ToastObject<any> }): React.ReactElement {
  return (
    <Toast.Root
      toast={toast}
      swipeDirection={["right", "up"]}
      className={clsx(
        "mx-4 my-2 rounded-md border border-highlight bg-filling/75 px-4 py-2 shadow-md shadow-backdrop/50 backdrop-blur-sm transition-all duration-200 tablet:my-4",
        css.toastRootTransition,
      )}
    >
      <Toast.Content className="flex items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <Toast.Title className="text-sm font-bold" />
          <Toast.Description className="text-sm text-fg-muted" />
        </div>
        <Toast.Close className="cursor-pointer text-sm text-fg-link">Dismiss</Toast.Close>
      </Toast.Content>
    </Toast.Root>
  );
}
