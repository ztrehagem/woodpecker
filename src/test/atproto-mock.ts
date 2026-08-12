import type { BrowserOAuthClient, OAuthSession } from "@atproto/oauth-client-browser";

import { Session, type OAuthResult } from "../shared/auth";

export const mockOAuthClient = {} as unknown as BrowserOAuthClient;

export const mockOAuthResult = {} as unknown as OAuthResult;

export function createMockSession(): Session {
  return new Session({} as unknown as OAuthSession);
}

export const mockSession = createMockSession();
