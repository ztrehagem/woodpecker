import React, { use, useSyncExternalStore } from "react";

import { CircleIcon } from "#src/shared/ui/icon/circle.tsx";
import { ProgressActivityIcon } from "#src/shared/ui/icon/progress-activity.tsx";

import { GlobalLoadingContext } from "./global-loading-context";

export function GlobalLoadingIndicator(): React.ReactElement {
  const store = use(GlobalLoadingContext);
  const isLoading = useSyncExternalStore(store.subscribe, () => store.isLoading());

  return isLoading ? (
    <div className="relative flex size-10 items-center justify-center">
      <CircleIcon />
      <ProgressActivityIcon className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-spin text-fg-muted [animation-duration:1s]" />
    </div>
  ) : (
    <></>
  );
}
