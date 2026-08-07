import { useCallback } from "react";

import { useOAuthClient } from "./atproto-context";

export function useSignIn(): (params: { handle: string }) => Promise<void> {
  const oauthClient = useOAuthClient();

  return useCallback(
    async ({ handle }) => {
      await oauthClient.signIn(handle, {
        state: "DUMMY_STATE",
      });
    },
    [oauthClient],
  );
}
