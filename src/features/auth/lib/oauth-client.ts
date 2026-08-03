import { BrowserOAuthClient, type ClientMetadata } from "@atproto/oauth-client-browser";
import atpClientMetadata from "#/public/atp-client-metadata.json";
import { use } from "react";
import { CachedClient } from "./cached-client";

const oauthClientPromise = import.meta.env.DEV
  ? (() => {
      const scopes = ["atproto", "rpc:app.bsky.actor.getProfile?aud=*"];
      return BrowserOAuthClient.load({
        clientId: `http://localhost?redirect_uri=${encodeURIComponent(`${location.origin}/callback`)}&scope=${encodeURIComponent(scopes.join(" "))}`,
        handleResolver: "https://bsky.social",
      });
    })()
  : Promise.resolve(
      new BrowserOAuthClient({
        clientMetadata: atpClientMetadata as ClientMetadata,
        handleResolver: "https://bsky.social",
      }),
    );

export function useOAuthClient(): BrowserOAuthClient {
  return use(oauthClientPromise);
}

type OAuthResult = Awaited<ReturnType<BrowserOAuthClient["init"]>>;

const oauthResultPromise = oauthClientPromise.then((client) => client.init());

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
