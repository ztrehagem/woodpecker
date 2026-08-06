import { Client } from "@atproto/lex";
import type { OAuthSession } from "@atproto/oauth-client-browser";

export class LexClient {
  readonly session: OAuthSession;
  /** Underlying RPC client, exposed for use as a TanStack Query queryFn dependency. */
  readonly rpc: Client;

  constructor(session: OAuthSession) {
    this.session = session;
    this.rpc = new Client(session);
  }
}
