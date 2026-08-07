import { useSession, useOAuthClient } from "#src/shared/lib/atproto/index.ts";

export function useSignOut(): () => Promise<void> {
  const oauthClient = useOAuthClient();
  const session = useSession();

  return async () => {
    await oauthClient.revoke(session.did);
    location.assign("/");
    await Promise.race([]); // never resolve, so the page doesn't re-render after the redirect
  };
}
