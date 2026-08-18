import { createContext } from "react";

import { ReactExternalStore } from "#src/shared/lib/react-external-store.ts";

export class GlobalLoadingStore extends ReactExternalStore {
  readonly #set = new Set<string>();

  isLoading(): boolean {
    return this.#set.size > 0;
  }

  add(id: string): void {
    this.#set.add(id);
    this.notifyChange();
  }

  remove(id: string): void {
    this.#set.delete(id);
    this.notifyChange();
  }
}

export const GlobalLoadingContext = createContext<GlobalLoadingStore>(new GlobalLoadingStore());
