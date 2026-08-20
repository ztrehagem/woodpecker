import React from "react";

import type { app } from "#src/shared/api/lexicons/index.ts";

import { ExternalEmbedView } from "./external-embed-view";
import { GalleryEmbedView } from "./gallery-embed-view";
import { ImagesEmbedView } from "./images-embed-view";
import { RecordEmbedView } from "./record-embed-view";
import { VideoEmbedView } from "./video-embed-view";

export function EmbedView({
  embed,
  skipRecordEmbed = false,
}: {
  embed: NonNullable<app.bsky.feed.defs.PostView["embed"]>;
  skipRecordEmbed?: boolean;
}): React.ReactElement {
  switch (embed.$type) {
    case "app.bsky.embed.external#view":
      return <ExternalEmbedView embed={embed as app.bsky.embed.external.View} />;
    case "app.bsky.embed.gallery#view":
      return <GalleryEmbedView embed={embed as app.bsky.embed.gallery.View} />;
    case "app.bsky.embed.images#view":
      return <ImagesEmbedView embed={embed as app.bsky.embed.images.View} />;
    case "app.bsky.embed.record#view":
      return skipRecordEmbed ? (
        <></>
      ) : (
        <RecordEmbedView
          embed={embed as app.bsky.embed.record.View}
          renderEmbed={(embed) => (
            <EmbedView
              embed={embed as NonNullable<app.bsky.feed.defs.PostView["embed"]>}
              skipRecordEmbed
            />
          )}
        />
      );
    case "app.bsky.embed.video#view":
      return <VideoEmbedView embed={embed as app.bsky.embed.video.View} />;
    default:
      return (
        <div className="rounded-md border border-filling px-3 py-2 text-sm text-fg-muted">
          Unsupported embed
          {import.meta.env.DEV && <pre className="text-2xs">{JSON.stringify(embed, null, 2)}</pre>}
        </div>
      );
  }
}
