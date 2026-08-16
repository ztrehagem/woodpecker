import { RichText, type AppBskyEmbedExternal, type BlobRef } from "@atproto/api";
import { toDatetimeString, type AtUriString } from "@atproto/lex";

import type { app } from "#src/shared/api/lexicons/index.ts";
import type { Session } from "#src/shared/auth/index.ts";

import type { ExternalEmbedPreview } from "./external-embed-query";

export async function createPost(
  session: Session,
  {
    text,
    reply,
    quote,
    externalEmbed,
  }: {
    text: string;
    reply?: app.bsky.feed.post.ReplyRef;
    quote?: { uri: AtUriString; cid: string };
    externalEmbed?: ExternalEmbedPreview;
  },
): Promise<{
  uri: string;
  cid: string;
}> {
  const rt = new RichText({ text });
  await rt.detectFacets(session.agent);

  const embed = await buildEmbed(session, quote, externalEmbed);

  return await session.agent.post({
    text: rt.text,
    facets: rt.facets,
    reply,
    embed,
    createdAt: toDatetimeString(new Date()),
  });
}

async function buildEmbed(
  session: Session,
  quote: { uri: AtUriString; cid: string } | undefined,
  externalEmbed: ExternalEmbedPreview | undefined,
) {
  if (quote) {
    return buildRecordEmbed(quote);
  }

  if (externalEmbed) {
    return await buildExternalEmbed(session, externalEmbed);
  }

  return void 0;
}

function buildRecordEmbed(quote: { uri: AtUriString; cid: string }): {
  $type: "app.bsky.embed.record";
  record: { uri: string; cid: string };
} {
  return {
    $type: "app.bsky.embed.record",
    record: { uri: quote.uri, cid: quote.cid },
  };
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
