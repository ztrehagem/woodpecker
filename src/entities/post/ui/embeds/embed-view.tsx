import React from "react";

import type { app } from "#src/shared/api/lexicons/index.ts";

import { ExternalEmbedView } from "./external-embed-view";
import { GalleryEmbedView } from "./gallery-embed-view";
import { ImagesEmbedView } from "./images-embed-view";
import { RecordEmbedView } from "./record-embed-view";
import { RecordWithMediaEmbedView } from "./record-with-media-embed-view";
import { VideoEmbedView } from "./video-embed-view";

export function EmbedView({
  embed,
}: {
  embed: NonNullable<app.bsky.feed.defs.PostView["embed"]>;
}): React.ReactElement {
  return renderEmbedView(embed);
}

function renderEmbedView(
  embed: NonNullable<app.bsky.feed.defs.PostView["embed"]>,
  key?: React.Key,
): React.ReactElement {
  switch (embed.$type) {
    case "app.bsky.embed.external#view":
      return <ExternalEmbedView key={key} embed={embed as app.bsky.embed.external.View} />;
    case "app.bsky.embed.gallery#view":
      return <GalleryEmbedView key={key} embed={embed as app.bsky.embed.gallery.View} />;
    case "app.bsky.embed.images#view":
      return <ImagesEmbedView key={key} embed={embed as app.bsky.embed.images.View} />;
    case "app.bsky.embed.record#view":
      return (
        <RecordEmbedView
          key={key}
          embed={embed as app.bsky.embed.record.View}
          renderEmbed={renderEmbedView}
        />
      );
    case "app.bsky.embed.recordWithMedia#view":
      return (
        <RecordWithMediaEmbedView key={key} embed={embed as app.bsky.embed.recordWithMedia.View} />
      );
    case "app.bsky.embed.video#view":
      return <VideoEmbedView key={key} embed={embed as app.bsky.embed.video.View} />;
    default:
      return (
        <div
          key={key}
          className="my-3 rounded-md border border-filling px-3 py-2 text-sm text-fg-muted"
        >
          Unsupported embed
          {import.meta.env.DEV && <pre className="text-2xs">{JSON.stringify(embed, null, 2)}</pre>}
        </div>
      );
  }
}
