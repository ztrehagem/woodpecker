import type { BrowserOAuthClient, OAuthSession } from "@atproto/oauth-client-browser";
import React from "react";

import { Session } from "../shared/auth";
import { AtProtoProvider, type OAuthResult } from "../shared/auth";

export function AtProtoMockProvider({ children }: React.PropsWithChildren): React.ReactElement {
  return (
    <AtProtoProvider
      oauthClient={Promise.resolve({} as unknown as BrowserOAuthClient)}
      oauthResult={Promise.resolve({} as unknown as OAuthResult)}
      session={Promise.resolve(new Session({} as unknown as OAuthSession))}
    >
      {children}
    </AtProtoProvider>
  );
}
