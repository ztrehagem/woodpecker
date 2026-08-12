import type { BrowserOAuthClient } from "@atproto/oauth-client-browser";
import React from "react";

import type { Session } from "../shared/auth";
import { AtProtoProvider, type OAuthResult } from "../shared/auth";
import { createMockSession, mockOAuthClient, mockOAuthResult } from "./atproto-mock";

export function AtProtoMockProvider({
  oauthClient = mockOAuthClient,
  oauthResult = mockOAuthResult,
  session = createMockSession(),
  children,
}: React.PropsWithChildren<{
  oauthClient?: BrowserOAuthClient;
  oauthResult?: OAuthResult;
  session?: Session;
}>): React.ReactElement {
  return (
    <AtProtoProvider
      oauthClient={Promise.resolve(oauthClient)}
      oauthResult={Promise.resolve(oauthResult)}
      session={Promise.resolve(session)}
    >
      {children}
    </AtProtoProvider>
  );
}
