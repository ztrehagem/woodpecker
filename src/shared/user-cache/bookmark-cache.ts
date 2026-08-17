import type { AtUriString } from "@atproto/lex";

import type { app } from "../api/lexicons";
import { ReactExternalStore } from "../lib/react-external-store";

export class BookmarkCache extends ReactExternalStore {
  readonly #cache = new Map<AtUriString, boolean>();

  get size(): number {
    return this.#cache.size;
  }

  get(view: app.bsky.feed.defs.PostView): boolean {
    return this.#cache.get(view.uri) ?? view.viewer?.bookmarked ?? false;
  }

  set(view: app.bsky.feed.defs.PostView, isBookmarked: boolean): void {
    this.#cache.set(view.uri, isBookmarked);
    this.notifyChange();
  }
}
