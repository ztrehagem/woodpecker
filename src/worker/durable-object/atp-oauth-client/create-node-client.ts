import { JoseKey } from "@atproto/jwk-jose";
import {
  NodeOAuthClient,
  type NodeSavedSession,
  type NodeSavedState,
} from "@atproto/oauth-client-node";

export async function createNodeClient(env: Env): Promise<NodeOAuthClient> {
  return new NodeOAuthClient({
    // fetch: globalThis.fetch,

    clientMetadata: {
      /* eslint-disable camelcase */
      client_id: "https://woodpecker.ztrehagem.app/client-metadata.json",
      redirect_uris: ["https://woodpecker.ztrehagem.app/oauth-callback"],
      grant_types: ["authorization_code", "refresh_token"],
      response_types: ["code"],
      application_type: "web",
      token_endpoint_auth_method: "private_key_jwt",
      dpop_bound_access_tokens: true,
      jwks_uri: "https://woodpecker.ztrehagem.app/oauth-jwks.json",
      // ↓ optional fields
      client_name: "Woodpecker",
      client_uri: "https://woodpecker.ztrehagem.app",
      logo_uri: "https://woodpecker.ztrehagem.app/favicon.webp",
      /** (string, optional): URL to human-readable terms of service (ToS) for the client. Only https: URIs are allowed. */
      // tos_uri: "https://woodpecker.ztrehagem.app/tos",
      /** (string, optional): URL to human-readable privacy policy for the client. Only https: URIs are allowed. */
      // policy_uri: "https://woodpecker.ztrehagem.app/policy",
      /* eslint-enable camelcase */
    },

    keyset: await Promise.all([
      JoseKey.fromImportable(env.ATP_OAUTH_JWK_1),
      JoseKey.fromImportable(env.ATP_OAUTH_JWK_2),
      JoseKey.fromImportable(env.ATP_OAUTH_JWK_3),
    ]),

    stateStore: {
      async set(key: string, internalState: NodeSavedState): Promise<void> {
        await env.KV_OAUTH_STATE.put(key, JSON.stringify(internalState), {
          expirationTtl: 30,
        });
      },
      async get(key: string): Promise<NodeSavedState | undefined> {
        return (
          (await env.KV_OAUTH_STATE.get<NodeSavedState>(key, "json")) ?? void 0
        );
      },
      async del(key: string): Promise<void> {
        await env.KV_OAUTH_STATE.delete(key);
      },
    },

    sessionStore: {
      async set(sub: string, session: NodeSavedSession): Promise<void> {
        await env.KV_OAUTH_SESSION.put(sub, JSON.stringify(session), {
          expirationTtl: 30,
        });
      },
      async get(sub: string): Promise<NodeSavedSession | undefined> {
        return (
          (await env.KV_OAUTH_SESSION.get<NodeSavedSession>(sub, "json")) ??
          void 0
        );
      },
      async del(sub: string): Promise<void> {
        await env.KV_OAUTH_SESSION.delete(sub);
      },
    },
  });
}
