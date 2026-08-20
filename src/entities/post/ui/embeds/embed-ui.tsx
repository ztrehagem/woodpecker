import React from "react";

import type { app } from "#src/shared/api/lexicons/index.ts";

import { ExternalEmbedUI } from "./external-embed-ui";
import { GalleryEmbedUI } from "./gallery-embed-ui";
import { ImagesEmbedUI } from "./images-embed-ui";
import { RecordEmbedUI } from "./record-embed-ui";
import { RecordWithMediaEmbedUI } from "./record-with-media-embed-ui";
import { VideoEmbedUI } from "./video-embed-ui";

export function EmbedUI({
  embed,
  skipRecordEmbed = false,
}: {
  embed: NonNullable<app.bsky.feed.defs.PostView["embed"]>;
  skipRecordEmbed?: boolean;
}): React.ReactElement {
  switch (embed.$type) {
    case "app.bsky.embed.external#view":
      return <ExternalEmbedUI embed={embed as app.bsky.embed.external.View} />;
    case "app.bsky.embed.gallery#view":
      return <GalleryEmbedUI embed={embed as app.bsky.embed.gallery.View} />;
    case "app.bsky.embed.images#view":
      return <ImagesEmbedUI embed={embed as app.bsky.embed.images.View} />;
    case "app.bsky.embed.record#view":
      return skipRecordEmbed ? (
        <></>
      ) : (
        <RecordEmbedUI
          embed={embed as app.bsky.embed.record.View}
          renderEmbed={(embed) => (
            <EmbedUI
              embed={embed as NonNullable<app.bsky.feed.defs.PostView["embed"]>}
              skipRecordEmbed
            />
          )}
        />
      );
    case "app.bsky.embed.recordWithMedia#view":
      return <RecordWithMediaEmbedUI embed={embed as app.bsky.embed.recordWithMedia.View} />;
    case "app.bsky.embed.video#view":
      return <VideoEmbedUI embed={embed as app.bsky.embed.video.View} />;
    default:
      return (
        <div className="rounded-md border border-filling px-3 py-2 text-sm text-fg-muted">
          Unsupported embed
          {import.meta.env.DEV && <pre className="text-2xs">{JSON.stringify(embed, null, 2)}</pre>}
        </div>
      );
  }
}
