import { Client, toDatetimeString, type AtIdentifierString, type CreateOutput } from "@atproto/lex";
import type { OAuthSession } from "@atproto/oauth-client-browser";

import type { Profile } from "#src/entities/profile/index.ts";
import type { FeedViewPost, Timeline } from "#src/entities/timeline/index.ts";
import { app } from "#src/shared/api/lexicons/index.ts";
import { Store } from "#src/shared/lib/react/index.ts";

interface State {
  timelineFeed: FeedViewPost[] | null;
}

export class LexClient extends Store<State> {
  readonly session: OAuthSession;
  readonly #client: Client;

  constructor(session: OAuthSession) {
    super({ timelineFeed: null });
    this.session = session;
    this.#client = new Client(session);
  }

  #profiles: Map<AtIdentifierString, Promise<Profile>> = new Map();

  async getProfile(id: AtIdentifierString = this.session.did): Promise<Profile> {
    let profile = this.#profiles.get(id);

    if (profile == null) {
      profile = this.#client.call(app.bsky.actor.getProfile, { actor: id });
      this.#profiles.set(id, profile);
    }

    return profile;
  }

  #getTimelinePromise: Promise<Timeline> | null = null;

  fetchTimeline({ limit = 50, force = false }: { limit?: number; force?: boolean } = {}): void {
    if (this.#getTimelinePromise == null || force) {
      this.#getTimelinePromise = this.#client.call(app.bsky.feed.getTimeline, { limit });

      this.#getTimelinePromise
        .then(({ feed }) => {
          this.setState((state) => ({ ...state, timelineFeed: feed }));
        })
        .catch(() => {});
    }
  }

  async createPost(text: string): Promise<CreateOutput> {
    return await this.#client.create(app.bsky.feed.post, {
      text,
      createdAt: toDatetimeString(new Date()),
    });
  }
}
