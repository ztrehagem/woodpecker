import React, { useState } from "react";
import { useRegisterSW } from "virtual:pwa-register/react";

import { NakedButton } from "./naked-button";

export function ReloadPrompt(): React.ReactElement {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW(
    import.meta.env.DEV
      ? {
          onRegistered(r) {
            console.log("SW Registered", r);
          },
          onRegisterError(error) {
            console.log("SW registration error", error);
          },
        }
      : void 0,
  );

  const [isReloading, setIsReloading] = useState(false);

  const close = () => {
    setOfflineReady(false);
    setNeedRefresh(false);
  };

  const refresh = () => {
    setIsReloading(true);
    void updateServiceWorker(true);
  };

  return (
    <div className="pointer-events-none m-0 size-0 p-0">
      {(offlineReady || needRefresh) && (
        <div className="fixed inset-x-0 bottom-5 z-(--index-popover)">
          <div className="mx-auto max-w-2xl px-3 tablet:px-8">
            <div className="pointer-events-auto mx-5 flex flex-wrap items-center justify-between gap-2 rounded-md bg-highlight px-5 py-4 text-sm">
              <div className="ReloadPrompt-message">
                {offlineReady
                  ? "App ready to work offline."
                  : "New app version available. Click the reload button to update."}
              </div>

              <div className="ml-auto flex gap-2">
                <NakedButton onClick={close}>Close</NakedButton>
                {needRefresh && (
                  <NakedButton processing={isReloading} emphasize onClick={refresh}>
                    Reload
                  </NakedButton>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
