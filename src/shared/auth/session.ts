import type { Did } from "@atproto/api";
import { Client } from "@atproto/lex";
import type { OAuthSession } from "@atproto/oauth-client-browser";

export class Session {
  readonly #session: OAuthSession;
  readonly client: Client;

  constructor(session: OAuthSession) {
    this.#session = session;
    this.client = new Client(session);
  }

  get did(): Did {
    return this.#session.did;
  }
}
