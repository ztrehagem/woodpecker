import type { NodeOAuthClient } from "@atproto/oauth-client-node";
import { DurableObject } from "cloudflare:workers";

import { createClient } from "./create-client";

/** @public */
export const pathnameClientMetadataJson = "/client-metadata.json";
/** @public */
export const pathnameJwksJson = "/jwks.json";

export class AtpOAuthClient extends DurableObject<Env> {
  client!: NodeOAuthClient;

  constructor(ctx: DurableObjectState, env: Env) {
    super(ctx, env);

    // eslint-disable-next-line sonarjs/no-async-constructor
    void ctx.blockConcurrencyWhile(async () => {
      try {
        this.client = await createClient(env);
      } catch (e) {
        console.log(e);
        throw e;
      }
    });
  }

  fetch(request: Request): Response {
    const url = new URL(request.url);

    switch (url.pathname) {
      case pathnameClientMetadataJson:
        return Response.json(this.client.clientMetadata);

      case pathnameJwksJson:
        return Response.json(this.client.jwks);
    }

    return new Response(null, { status: 404 });
  }

  async getOAuthLoginUrl({ handle }: { handle: string }): Promise<string> {
    const state = crypto.getRandomValues(new Uint32Array(1)).at(0)!.toFixed();

    try {
      const url = await this.client.authorize(handle, {
        state,
        // ui_locales: 'ja-JP',
      });

      return url.toString();
    } catch (e) {
      console.log("ERROR getOAuthLoginUrl()", e);
      throw e;
    }
  }
}
