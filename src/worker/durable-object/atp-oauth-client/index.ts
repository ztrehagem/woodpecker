import type { NodeOAuthClient } from "@atproto/oauth-client-node";
import { DurableObject } from "cloudflare:workers";
import { z } from "zod";

import { createClient } from "./create-client";

/** @public */
export const pathnameClientMetadataJson = "/client-metadata.json";
/** @public */
export const pathnameJwksJson = "/jwks.json";
/** @public */
export const pathnameLogin = "/api/login";

export class AtpOAuthClient extends DurableObject<Env> {
  client!: NodeOAuthClient;

  constructor(ctx: DurableObjectState, env: Env) {
    super(ctx, env);

    // eslint-disable-next-line sonarjs/no-async-constructor
    void ctx.blockConcurrencyWhile(async () => {
      this.client = await createClient(env);
    });
  }

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);

    switch (url.pathname) {
      case pathnameClientMetadataJson:
        return Response.json(this.client.clientMetadata);

      case pathnameJwksJson:
        return Response.json(this.client.jwks);

      case pathnameLogin: {
        // const fd = await request.formData();
        // const handle = z.string().parse(fd.get("handle"));
        const params = new URL(request.url).searchParams;
        const handle = z.string().parse(params.get("handle"));

        const state = crypto
          .getRandomValues(new Uint32Array(1))
          .at(0)!
          .toFixed();

        const url = await this.client.authorize(handle, {
          state,
          // ui_locales: 'ja-JP',
        });

        return Response.redirect(url.toString(), 307);
      }
    }

    return new Response(null, { status: 404 });
  }
}
