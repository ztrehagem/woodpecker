import type { AtUriString } from "@atproto/lex";

import type { Session } from "#src/shared/auth/index.ts";

export async function likePost(
  session: Session,
  uri: AtUriString,
  cid: string,
): Promise<{
  uri: AtUriString;
  cid: string;
}> {
  // return await session.client.create(app.bsky.feed.like, {
  //   subject: {
  //     uri,
  //     cid,
  //   },
  //   createdAt: toDatetimeString(new Date()),
  // });
  const result = await session.agent.like(uri, cid);
  return { uri: result.uri as AtUriString, cid: result.cid };
}
