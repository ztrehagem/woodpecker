import { JoseKey } from "@atproto/jwk-jose";
import type { InternalStateData, Key, Session } from "@atproto/oauth-client";
import { OAuthClient } from "@atproto/oauth-client";

/**
 * @see https://www.npmjs.com/package/@atproto/oauth-client
 */
export async function createClient(env: Env): Promise<OAuthClient> {
  const client = new OAuthClient({
    handleResolver: "https://public.api.bsky.app",
    // handleResolver: {
    //   async resolve(handle, _options) {
    //     console.log("resolving handle", handle, _options);
    //     const url = new URL(
    //       "https://public.api.bsky.app/xrpc/com.atproto.identity.resolveHandle",
    //     );
    //     url.searchParams.set("handle", handle);
    //     const response = await fetch(url);
    //     console.log("response status", response.status);
    //     if (!response.ok) {
    //       throw new Error("failed to resolve handle");
    //     }
    //     const json = await response.json();
    //     console.log("json", json);
    //     const { did } = json as { did: string };
    //     return did as ResolvedHandle;
    //   },
    // },
    responseMode: "query",
    allowHttp: true,

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
          expirationTtl: 60,
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
          expirationTtl: 60,
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

    fetch: async (input, init) => {
      // console.log("fetch init", init);
      const request = new Request(input, { ...init, redirect: "manual" });
      // const request = new Request(input, { ...init });
      console.log("request", request);

      try {
        const response = await fetch(request);

        console.log("responsed", response.status);

        if (300 <= response.status && response.status <= 399) {
          throw new Error(
            `fetch(${request.url}) is redirected with status ${response.status.toString()}`,
          );
        }

        return response;
      } catch (e) {
        console.log("fetch error", e);
        throw e;
      }
    },
  });

  const oauthResolverResolve = client.oauthResolver.resolve;
  client.oauthResolver.resolve = async function (
    this: OAuthClient["oauthResolver"],
    ...args
  ) {
    console.log("oauthResolver.resolve()", ...args);
    try {
      return await oauthResolverResolve.call(this, ...args);
    } catch (e) {
      console.log("error on oauthResolver.resolve()", e);
      throw e;
    }
  };

  const identityResolverResolve = client.oauthResolver.identityResolver.resolve;
  client.oauthResolver.identityResolver.resolve = function (
    this: OAuthClient["oauthResolver"]["identityResolver"],
    ...args
  ) {
    console.log("identityResolver.resolve()", ...args);
    return identityResolverResolve.call(this, ...args);
  };

  const handleResolverResolve =
    client.oauthResolver.identityResolver.handleResolver.resolve;
  client.oauthResolver.identityResolver.handleResolver.resolve =
    async function (
      this: OAuthClient["oauthResolver"]["identityResolver"]["handleResolver"],
      ...args
    ) {
      console.log("handleResolver.resolve()", ...args);
      try {
        return await handleResolverResolve.call(this, ...args);
      } catch (e) {
        console.log("error on handleResolver.resolve()", e);
        throw e;
      }
    };

  const didResolverResolve =
    client.oauthResolver.identityResolver.didResolver.resolve;
  client.oauthResolver.identityResolver.didResolver.resolve = async function (
    this: OAuthClient["oauthResolver"]["identityResolver"]["didResolver"],
    did,
    options,
  ) {
    console.log("didResolver.resolve()", did, options);
    try {
      return await didResolverResolve.call(this, did, options);
    } catch (e) {
      console.log("error on didResolver.resolve()", e);
      throw e;
    }
  };

  return client;
}
