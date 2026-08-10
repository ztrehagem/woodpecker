import type { AtUriString } from "@atproto/lex";

import type { app } from "#src/shared/api/lexicons/index.ts";

export function buildPostHref(post: {
  uri: AtUriString;
  author: app.bsky.actor.defs.ProfileViewBasic;
}): string | null {
  const matches = post.uri.match(/at:\/\/([^/]+)\/([^/]+)\/([^/]+)/);

  const [, did, nsid, key] = matches ?? [];

  const isBskyPost = nsid === "app.bsky.feed.post" && key != null;
  const isMatchAuthor = did === post.author.did;

  if (isBskyPost && isMatchAuthor) {
    return `/profile/${post.author.handle}/post/${key}`;
  }

  return null;
}
