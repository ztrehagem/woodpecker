import type { Did } from "@atproto/api";
import { Client } from "@atproto/lex";
import type { OAuthSession } from "@atproto/oauth-client-browser";
import { use } from "react";

import { oauthResultPromise } from "./oauth-result";

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

export const sessionPromise = oauthResultPromise.then((result) => {
  if (result == null) {
    return null;
  }
  return new Session(result.session);
});

export function useAssertSession(): Session {
  const session = use(sessionPromise);

  if (session == null) {
    throw new Error("No cached client available. User is not authenticated.");
  }

  return session;
}

export function useSession(): Session | null {
  return use(sessionPromise);
}
