import { Client, toDatetimeString, type AtIdentifierString, type CreateOutput } from "@atproto/lex";
import type { OAuthSession } from "@atproto/oauth-client-browser";

import type { Profile } from "#src/entities/profile/index.ts";
import { app } from "#src/shared/api/lexicons/index.ts";

export class LexClient {
  readonly session: OAuthSession;
  /** Underlying RPC client, exposed for use as a TanStack Query queryFn dependency. */
  readonly rpc: Client;

  constructor(session: OAuthSession) {
    this.session = session;
    this.rpc = new Client(session);
  }

  #profiles: Map<AtIdentifierString, Promise<Profile>> = new Map();

  async getProfile(id: AtIdentifierString = this.session.did): Promise<Profile> {
    let profile = this.#profiles.get(id);

    if (profile == null) {
      profile = this.rpc.call(app.bsky.actor.getProfile, { actor: id });
      this.#profiles.set(id, profile);
    }

    return profile;
  }

  async createPost(text: string): Promise<CreateOutput> {
    return await this.rpc.create(app.bsky.feed.post, {
      text,
      createdAt: toDatetimeString(new Date()),
    });
  }
}
