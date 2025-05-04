import { JoseKey } from "@atproto/jwk-jose";
import type { InternalStateData, Key, Session } from "@atproto/oauth-client";
import { OAuthClient } from "@atproto/oauth-client";

/**
 * @see https://www.npmjs.com/package/@atproto/oauth-client
 */
export async function createClient(env: Env): Promise<OAuthClient> {
  return new OAuthClient({
    handleResolver: "https://bsky.social",
    responseMode: "query",

    clientMetadata: {
      /* eslint-disable camelcase */
      client_id: "https://woodpecker.ztrehagem.app/client-metadata.json",
      redirect_uris: ["https://woodpecker.ztrehagem.app/oauth-callback"],
      grant_types: ["authorization_code", "refresh_token"],
      response_types: ["code"],
      application_type: "web",
      token_endpoint_auth_method: "private_key_jwt",
      token_endpoint_auth_signing_alg: "ES256",
      dpop_bound_access_tokens: true,
      jwks_uri: "https://woodpecker.ztrehagem.app/oauth-jwks.json",
      scope: "atproto",
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
      async set(key: string, internalState: InternalStateData): Promise<void> {
        await env.KV_OAUTH_STATE.put(key, JSON.stringify(internalState), {
          expirationTtl: 30,
        });
      },
      async get(key: string): Promise<InternalStateData | undefined> {
        return (
          (await env.KV_OAUTH_STATE.get<InternalStateData>(key, "json")) ??
          void 0
        );
      },
      async del(key: string): Promise<void> {
        await env.KV_OAUTH_STATE.delete(key);
      },
    },

    sessionStore: {
      async set(sub: string, session: Session): Promise<void> {
        await env.KV_OAUTH_SESSION.put(sub, JSON.stringify(session), {
          expirationTtl: 30,
        });
      },
      async get(sub: string): Promise<Session | undefined> {
        return (await env.KV_OAUTH_SESSION.get<Session>(sub, "json")) ?? void 0;
      },
      async del(sub: string): Promise<void> {
        await env.KV_OAUTH_SESSION.delete(sub);
      },
    },

    runtimeImplementation: {
      createKey(algs: string[]): Promise<Key> {
        return JoseKey.generate(algs);
      },

      getRandomValues(length: number): Uint8Array {
        return crypto.getRandomValues(new Uint8Array(length));
      },

      async digest(
        bytes: Uint8Array,
        algorithm: { name: string },
      ): Promise<Uint8Array> {
        if (algorithm.name.startsWith("sha")) {
          const subtleAlgo = `SHA-${algorithm.name.slice(3)}`;
          const buffer = await crypto.subtle.digest(subtleAlgo, bytes);
          return new Uint8Array(buffer);
        }

        throw new TypeError(`Unsupported algorithm: ${algorithm.name}`);
      },
    },
  });
}
