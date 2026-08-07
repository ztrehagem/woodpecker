import { BrowserOAuthClient } from "@atproto/oauth-client-browser";

import { scopes } from "#shared/atproto/scope.ts";
import { Session, type OAuthResult } from "#src/shared/lib/atproto/index.ts";

export const oauthClientPromise: Promise<BrowserOAuthClient> = import.meta.env.DEV
  ? (() => {
      const redirectUri = `${location.origin}/callback`;
      const scope = scopes.join(" ");

      return BrowserOAuthClient.load({
        clientId: `http://localhost?redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}`,
        handleResolver: "https://bsky.social",
      });
    })()
  : BrowserOAuthClient.load({
      clientId: `${location.origin}/atp-client-metadata.json`,
      handleResolver: "https://bsky.social",
    });

export const oauthResultPromise: Promise<OAuthResult | null> = oauthClientPromise
  .then((client) => client.init())
  .catch((error) => {
    console.error(error);
    return null;
  });

export const sessionPromise: Promise<Session | null> = oauthResultPromise.then((result) => {
  if (result == null) {
    return null;
  }
  return new Session(result.session);
});
