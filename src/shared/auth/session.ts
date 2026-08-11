import { Agent, type Did } from "@atproto/api";
import { Client } from "@atproto/lex";
import type { OAuthSession } from "@atproto/oauth-client-browser";

export class Session {
  readonly #oauthSession: OAuthSession;
  readonly agent: Agent;
  readonly client: Client;

  constructor(oauthSession: OAuthSession) {
    this.#oauthSession = oauthSession;
    this.agent = new Agent(oauthSession);
    this.client = new Client(oauthSession);
  }

  get did(): Did {
    return this.#oauthSession.did;
  }
}
