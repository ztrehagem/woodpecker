import type { AtUriString } from "@atproto/lex";

import type { app } from "../api/lexicons";

type PostUri = AtUriString;
type LikeUri = AtUriString;

export class LikeCache {
  readonly #map = new Map<PostUri, LikeUri | null>();

  get size(): number {
    return this.#map.size;
  }

  get(view: app.bsky.feed.defs.PostView): LikeUri | null | undefined {
    return this.#map.has(view.uri) ? this.#map.get(view.uri) : (view.viewer?.like ?? null);
  }

  set(view: app.bsky.feed.defs.PostView, likeUri: LikeUri | null): void {
    this.#map.set(view.uri, likeUri);
  }
}
