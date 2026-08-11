import type { Session } from "#src/shared/auth/index.ts";

export async function likePost(
  session: Session,
  uri: string,
  cid: string,
): Promise<{
  uri: string;
  cid: string;
}> {
  // return await session.client.create(app.bsky.feed.like, {
  //   subject: {
  //     uri,
  //     cid,
  //   },
  //   createdAt: toDatetimeString(new Date()),
  // });
  return await session.agent.like(uri, cid);
}
