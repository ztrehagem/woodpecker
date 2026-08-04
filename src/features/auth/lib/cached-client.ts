import type { Did } from "@atproto/api";
import { Client, type AtIdentifierString } from "@atproto/lex";
import type { OAuthSession } from "@atproto/oauth-client-browser";

import type { Profile } from "#src/entities/profile/index.ts";
import type { Timeline } from "#src/entities/timeline/index.ts";
import { app } from "#src/shared/api/lexicons/index.ts";

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

  #profiles: Map<AtIdentifierString, Promise<Profile>> = new Map();

  async getProfile(id: AtIdentifierString = this.#session.did): Promise<Profile> {
    let profile = this.#profiles.get(id);

    if (profile == null) {
      profile = this.#client.call(app.bsky.actor.getProfile, { actor: id });
      this.#profiles.set(id, profile);
    }

    return profile;
  }

  #timeline: Promise<Timeline> | null = null;

  async getTimeline(): Promise<Timeline> {
    if (this.#timeline == null) {
      this.#timeline = this.#client.call(app.bsky.feed.getTimeline, { limit: 50 });
    }
    return this.#timeline;
  }
}
