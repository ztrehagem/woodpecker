import type { OAuthClient } from "@atproto/oauth-client";

export interface HonoEnv {
  Bindings: Env;
  Variables: {
    readonly atpOAuthClient: OAuthClient;
  };
}
