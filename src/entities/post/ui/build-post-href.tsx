import { AtUri } from "@atproto/api";
import type { AtUriString } from "@atproto/lex";

import type { app } from "#src/shared/api/lexicons/index.ts";

export function buildPostHref(post: {
  uri: AtUriString;
  author?: app.bsky.actor.defs.ProfileViewBasic;
}): string | null {
  const { collection, did, rkey } = new AtUri(post.uri);
  const isBskyPost = collection === "app.bsky.feed.post" && rkey != null;

  if (!isBskyPost) {
    return null;
  }

  if (post.author == null) {
    return `/profile/${did}/post/${rkey}`;
  }

  const isMatchAuthor = did === post.author.did;

  if (isBskyPost && isMatchAuthor) {
    return `/profile/${post.author.handle}/post/${rkey}`;
  }

  return null;
}
