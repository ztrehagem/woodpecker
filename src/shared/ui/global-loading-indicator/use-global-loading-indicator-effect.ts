import { use, useEffect, useId } from "react";

import { GlobalLoadingContext } from "./global-loading-context";

export function useGlobalLoadingIndicatorEffect(isLoading: boolean): void {
  const store = use(GlobalLoadingContext);
  const id = useId();

  useEffect(() => {
    if (isLoading) {
      store.add(id);

      return () => {
        store.remove(id);
      };
    }
  }, [isLoading, id, store]);
}
