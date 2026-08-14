import type { AtUriString } from "@atproto/lex";

import type { app } from "../api/lexicons";

// oxlint-disable-next-line sonarjs/redundant-type-aliases
type PostCid = string;
type LikeUri = AtUriString;

export class LikeCache {
  readonly #map = new Map<PostCid, LikeUri | null>();

  get size(): number {
    return this.#map.size;
  }

  get(view: app.bsky.feed.defs.PostView): LikeUri | null | undefined {
    return this.#map.has(view.cid) ? this.#map.get(view.cid) : (view.viewer?.like ?? null);
  }

  set(view: app.bsky.feed.defs.PostView, likeUri: LikeUri | null): void {
    this.#map.set(view.cid, likeUri);
  }
}
