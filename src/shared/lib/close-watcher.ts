import { useEffect } from "react";

export function useCloseWatcherEffect(isOpen: boolean, setIsOpen: (isOpen: boolean) => void): void {
  useEffect(() => {
    // Enables closing the dialog with the back gesture / button (Chromium-based browsers).
    if (!isOpen || typeof CloseWatcher === "undefined") {
      return;
    }

    const closeWatcher = new CloseWatcher();
    closeWatcher.addEventListener("close", () => {
      setIsOpen(false);
    });

    return () => {
      closeWatcher.destroy();
    };
  }, [isOpen, setIsOpen]);
}
