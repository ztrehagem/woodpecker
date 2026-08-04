import { BrowserOAuthClient } from "@atproto/oauth-client-browser";
import { use } from "react";

import { CachedClient } from "./cached-client";

const oauthClientPromise = import.meta.env.DEV
  ? (() => {
      const redirectUri = `${location.origin}/callback`;
      const scopes = [
        "atproto",
        "rpc:app.bsky.actor.getProfile?aud=*",
        "rpc:app.bsky.feed.getTimeline?aud=*",
      ];
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

type OAuthResult = Awaited<ReturnType<BrowserOAuthClient["init"]>>;

const oauthResultPromise = oauthClientPromise
  .then((client) => client.init())
  .catch((error) => {
    console.error(error);
    return null;
  });

export function useOAuthResult(): OAuthResult | null {
  return use(oauthResultPromise);
}

const cachedClientPromise = oauthResultPromise.then((result) => {
  if (result == null) {
    return null;
  }
  return new CachedClient(result.session);
});

export function useCachedClient(): CachedClient {
  const client = use(cachedClientPromise);

  if (client == null) {
    throw new Error("No cached client available. User is not authenticated.");
  }

  return client;
}
