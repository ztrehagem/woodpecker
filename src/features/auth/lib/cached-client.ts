import { app } from "#src/shared/api/lexicons/index.ts";
import { Client } from "@atproto/lex";
import type { OAuthSession } from "@atproto/oauth-client-browser";

export class CachedClient {
  readonly #session: OAuthSession;
  readonly #client: Client;
  #profile: Promise<app.bsky.actor.defs.ProfileViewDetailed> | null = null;

  constructor(session: OAuthSession) {
    this.#session = session;
    this.#client = new Client(session);
  }

  async getProfile(): Promise<app.bsky.actor.defs.ProfileViewDetailed> {
    if (this.#profile == null) {
      this.#profile = this.#client.call(app.bsky.actor.getProfile, { actor: this.#session.did });
    }
    return this.#profile;
  }
}
