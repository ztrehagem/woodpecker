import type { Did } from "@atproto/api";
import { Client } from "@atproto/lex";
import type { OAuthSession } from "@atproto/oauth-client-browser";

import { app } from "#src/shared/api/lexicons/index.ts";

import type { Profile } from "../model/profile";
import type { Timeline } from "../model/timeline";

export class CachedClient {
  readonly #session: OAuthSession;
  readonly #client: Client;

  constructor(session: OAuthSession) {
    this.#session = session;
    this.#client = new Client(session);
  }

  get did(): Did {
    return this.#session.did;
  }

  #profile: Promise<Profile> | null = null;

  async getProfile(): Promise<Profile> {
    if (this.#profile == null) {
      this.#profile = this.#client.call(app.bsky.actor.getProfile, { actor: this.#session.did });
    }
    return this.#profile;
  }

  #timeline: Promise<Timeline> | null = null;

  async getTimeline(): Promise<Timeline> {
    if (this.#timeline == null) {
      this.#timeline = this.#client.call(app.bsky.feed.getTimeline, { limit: 50 });
    }
    return this.#timeline;
  }
}
