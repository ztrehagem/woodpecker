import type { OAuthClientMetadataInput } from "@atproto/oauth-client-browser";

import { scopes } from "#shared/atproto/scope.ts";

const allowedOrigins = [
  /^https:\/\/woodpecker\.ztrehagem\.app$/,
  /^https:\/\/.*-woodpecker\.ztrehagem\.workers\.dev$/,
];

export function createAtpClientMetadata(request: Request): OAuthClientMetadataInput | null {
  const url = new URL(request.url);

  if (!allowedOrigins.some((pattern) => pattern.test(url.origin))) {
    return null;
  }

  return {
    client_id: `${url.origin}/atp-client-metadata.json`,
    client_name: "Woodpecker",
    client_uri: `${url.origin}`,
    logo_uri: `${url.origin}/favicon.webp`,
    redirect_uris: [`${url.origin}/callback`],
    application_type: "web",
    grant_types: ["authorization_code", "refresh_token"],
    scope: scopes.join(" "),
    response_types: ["code"],
    token_endpoint_auth_method: "none",
    dpop_bound_access_tokens: true,
  };
}
