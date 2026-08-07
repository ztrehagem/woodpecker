import type { BrowserOAuthClient } from "@atproto/oauth-client-browser";
import { createContext, use } from "react";

import type { Session } from "./session";

export const OAuthClientContext = createContext<Promise<BrowserOAuthClient> | null>(null);

export function useOAuthClient(): BrowserOAuthClient {
  const oauthClientPromise = use(OAuthClientContext);

  if (oauthClientPromise == null) {
    throw new Error("No OAuth client available.");
  }

  return use(oauthClientPromise);
}

export type OAuthResult = Awaited<ReturnType<BrowserOAuthClient["init"]>>;

export const OAuthResultContext = createContext<Promise<OAuthResult | null> | null>(null);

export const SessionContext = createContext<Promise<Session | null> | null>(null);

export function useSession(): Session | null {
  const sessionPromise = use(SessionContext);

  if (sessionPromise == null) {
    return null;
  }

  return use(sessionPromise);
}

export function useAssertSession(): Session {
  const session = useSession();

  if (session == null) {
    throw new Error("No cached client available. User is not authenticated.");
  }

  return session;
}
