import { useEffect, useEffectEvent } from "react";

export function useCloseWatcherEffect(
  isOpen: boolean,
  setIsOpen: (isOpen: boolean) => void,
  {
    preventClose = false,
    onPreventClose,
  }: { preventClose?: boolean; onPreventClose?: () => void } = {},
): void {
  const onPreventCloseEvent = useEffectEvent(() => {
    onPreventClose?.();
  });

  useEffect(() => {
    // Enables closing the dialog with the back gesture / button (Chromium-based browsers).
    if (!isOpen || typeof CloseWatcher === "undefined") {
      return;
    }

    const closeWatcher = new CloseWatcher();

    closeWatcher.addEventListener("cancel", (e) => {
      if (preventClose) {
        e.preventDefault();
        onPreventCloseEvent();
      }
    });

    closeWatcher.addEventListener("close", () => {
      setIsOpen(false);
    });

    return () => {
      closeWatcher.destroy();
    };
  }, [isOpen, setIsOpen, preventClose]);
}
