import { Agent, type Did } from "@atproto/api";
import { Client } from "@atproto/lex";
import type { OAuthSession } from "@atproto/oauth-client-browser";

import { BookmarkCache } from "../user-cache/bookmark-cache";
import { LikeCache } from "../user-cache/like-cache";
import { RepostCache } from "../user-cache/repost-cache";

export class Session {
  readonly #oauthSession: OAuthSession;
  readonly agent: Agent;
  readonly client: Client;
  readonly repostCache = new RepostCache();
  readonly likeCache = new LikeCache();
  readonly bookmarkCache = new BookmarkCache();

  constructor(oauthSession: OAuthSession) {
    this.#oauthSession = oauthSession;
    this.agent = new Agent(oauthSession);
    this.client = new Client(oauthSession);
  }

  get did(): Did {
    return this.#oauthSession.did;
  }
}
