import { RichText } from "@atproto/api";
import { toDatetimeString } from "@atproto/lex";

import type { Session } from "#src/shared/auth/index.ts";

export async function createPost(
  session: Session,
  text: string,
): Promise<{
  uri: string;
  cid: string;
}> {
  const rt = new RichText({ text });
  await rt.detectFacets(session.agent);

  return await session.agent.post({
    text: rt.text,
    facets: rt.facets,
    createdAt: toDatetimeString(new Date()),
  });
}
