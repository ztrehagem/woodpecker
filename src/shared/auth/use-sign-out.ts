import { useAssertSession, useOAuthClient } from "./atproto-context";

export function useSignOut(): () => Promise<void> {
  const oauthClient = useOAuthClient();
  const session = useAssertSession();

  return async () => {
    await oauthClient.revoke(session.did);
    location.assign("/");
    await Promise.race([]); // never resolve, so the page doesn't re-render after the redirect
  };
}
