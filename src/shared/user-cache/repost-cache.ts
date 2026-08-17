import type { AtUriString } from "@atproto/lex";

import type { app } from "../api/lexicons";
import { ReactExternalStore } from "../lib/react-external-store";

// oxlint-disable-next-line sonarjs/redundant-type-aliases
type PostCid = string;
type RepostUri = AtUriString;

export class RepostCache extends ReactExternalStore {
  readonly #map = new Map<PostCid, RepostUri | null>();

  get size(): number {
    return this.#map.size;
  }

  get(view: app.bsky.feed.defs.PostView): RepostUri | null | undefined {
    return this.#map.has(view.cid) ? this.#map.get(view.cid) : (view.viewer?.repost ?? null);
  }

  set(view: app.bsky.feed.defs.PostView, repostUri: RepostUri | null): void {
    this.#map.set(view.cid, repostUri);
    this.notifyChange();
  }
}
