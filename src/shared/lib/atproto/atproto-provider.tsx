import type { BrowserOAuthClient } from "@atproto/oauth-client-browser";

import {
  OAuthClientContext,
  OAuthResultContext,
  SessionContext,
  type OAuthResult,
} from "./atproto-context";
import type { Session } from "./session";

export function AtProtoProvider({
  oauthClient,
  oauthResult,
  session,
  children,
}: {
  oauthClient: Promise<BrowserOAuthClient>;
  oauthResult: Promise<OAuthResult | null>;
  session: Promise<Session | null>;
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <OAuthClientContext value={oauthClient}>
      <OAuthResultContext value={oauthResult}>
        <SessionContext value={session}>{children}</SessionContext>
      </OAuthResultContext>
    </OAuthClientContext>
  );
}
