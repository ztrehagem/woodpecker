import { RichText, type AppBskyEmbedExternal, type BlobRef } from "@atproto/api";
import { toDatetimeString } from "@atproto/lex";

import type { Session } from "#src/shared/auth/index.ts";

import type { ExternalEmbedPreview } from "./external-embed-query";

export async function createPost(
  session: Session,
  text: string,
  externalEmbed?: ExternalEmbedPreview,
): Promise<{
  uri: string;
  cid: string;
}> {
  const rt = new RichText({ text });
  await rt.detectFacets(session.agent);

  const embed = externalEmbed ? await buildExternalEmbed(session, externalEmbed) : void 0;

  return await session.agent.post({
    text: rt.text,
    facets: rt.facets,
    embed,
    createdAt: toDatetimeString(new Date()),
  });
}

async function buildExternalEmbed(
  session: Session,
  { uri, title, description, thumb: thumbUri }: ExternalEmbedPreview,
): Promise<{ $type: "app.bsky.embed.external"; external: AppBskyEmbedExternal.External }> {
  const thumb = thumbUri != null ? await uploadThumb(session, thumbUri) : void 0;

  return {
    $type: "app.bsky.embed.external",
    external: { uri, title, description, thumb },
  };
}

async function uploadThumb(session: Session, thumbUri: string): Promise<BlobRef | undefined> {
  try {
    const res = await fetch(thumbUri);
    if (!res.ok) {
      return void 0;
    }

    const blob = await res.blob();
    const { data } = await session.agent.uploadBlob(blob, { encoding: blob.type || "image/jpeg" });

    return data.blob;
  } catch {
    return void 0;
  }
}
