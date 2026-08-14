import type { AtUriString } from "@atproto/lex";

import type { app } from "../api/lexicons";

export class BookmarkCache {
  readonly #cache = new Map<AtUriString, boolean>();

  get size(): number {
    return this.#cache.size;
  }

  get(view: app.bsky.feed.defs.PostView): boolean {
    return this.#cache.get(view.uri) ?? view.viewer?.bookmarked ?? false;
  }

  set(view: app.bsky.feed.defs.PostView, isBookmarked: boolean): void {
    this.#cache.set(view.uri, isBookmarked);
  }
}
