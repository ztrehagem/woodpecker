import { useCachedClient, useOAuthClient } from "./oauth-client";

export function useSignOut(): () => Promise<void> {
  const oauthClient = useOAuthClient();
  const client = useCachedClient();

  return async () => {
    await oauthClient.revoke(client.session.did);
    location.assign("/");
    await Promise.race([]); // never resolve, so the page doesn't re-render after the redirect
  };
}
