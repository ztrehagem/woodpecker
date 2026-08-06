import { BrowserOAuthClient } from "@atproto/oauth-client-browser";
import { use } from "react";

export const oauthClientPromise = import.meta.env.DEV
  ? (() => {
      const redirectUri = `${location.origin}/callback`;
      const scopes = [
        "atproto",
        "rpc:app.bsky.actor.getProfile?aud=*",
        "rpc:app.bsky.feed.getTimeline?aud=*",
        "repo:*",
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
