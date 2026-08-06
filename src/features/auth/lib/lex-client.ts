import { Client, toDatetimeString, type CreateOutput } from "@atproto/lex";
import type { OAuthSession } from "@atproto/oauth-client-browser";

import { app } from "#src/shared/api/lexicons/index.ts";

export class LexClient {
  readonly session: OAuthSession;
  /** Underlying RPC client, exposed for use as a TanStack Query queryFn dependency. */
  readonly rpc: Client;

  constructor(session: OAuthSession) {
    this.session = session;
    this.rpc = new Client(session);
  }

  async createPost(text: string): Promise<CreateOutput> {
    return await this.rpc.create(app.bsky.feed.post, {
      text,
      createdAt: toDatetimeString(new Date()),
    });
  }
}
