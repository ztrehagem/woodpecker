import type { BrowserOAuthClient } from "@atproto/oauth-client-browser";
import { use } from "react";

import { oauthClientPromise } from "./oauth-client";

type OAuthResult = Awaited<ReturnType<BrowserOAuthClient["init"]>>;

export const oauthResultPromise = oauthClientPromise
  .then((client) => client.init())
  .catch((error) => {
    console.error(error);
    return null;
  });

export function useOAuthResult(): OAuthResult | null {
  return use(oauthResultPromise);
}
