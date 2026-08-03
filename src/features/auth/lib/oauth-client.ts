import { BrowserOAuthClient, type ClientMetadata } from "@atproto/oauth-client-browser";
import atpClientMetadata from "../../../../public/atp-client-metadata.json";
import { use } from "react";

const oauthClientPromise = import.meta.env.DEV
  ? BrowserOAuthClient.load({
      clientId: `http://localhost?redirect_uri=${encodeURIComponent(`${location.origin}/callback`)}`,
      handleResolver: "https://bsky.social",
    })
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
