import { BrowserOAuthClient } from "@atproto/oauth-client-browser";
import { use } from "react";

import { scopes } from "#shared/atproto/scope.ts";

export const oauthClientPromise = import.meta.env.DEV
  ? (() => {
      const redirectUri = `${location.origin}/callback`;

      return BrowserOAuthClient.load({
        clientId: `http://localhost?redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scopes.join(" "))}`,
        handleResolver: "https://bsky.social",
      });
    })()
  : BrowserOAuthClient.load({
      clientId: `${location.origin}/atp-client-metadata.json`,
      handleResolver: "https://bsky.social",
    });

export function useOAuthClient(): BrowserOAuthClient {
  return use(oauthClientPromise);
}
