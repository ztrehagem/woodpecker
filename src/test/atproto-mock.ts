import type { AtprotoDid, BrowserOAuthClient, OAuthSession } from "@atproto/oauth-client-browser";

import { Session, type OAuthResult } from "../shared/auth";

export const mockOAuthClient = {} as unknown as BrowserOAuthClient;

export const mockOAuthResult = {} as unknown as OAuthResult;

export function createMockSession(did?: AtprotoDid): Session {
  return new Session({ did } as unknown as OAuthSession);
}

export const mockSession = createMockSession();
