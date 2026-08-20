import React from "react";

import type { app } from "#src/shared/api/lexicons/index.ts";
import { LoadingDotsIcon } from "#src/shared/ui/icon/index.ts";

import { type ExternalEmbedPreview } from "../../api/external-embed-query";
import { ExternalEmbedView } from "../embeds/external-embed-view";

export function ExternalEmbedPreview({
  firstEmbedLink,
  isLoading,
  preview,
}: {
  firstEmbedLink: URL | null;
  isLoading: boolean;
  preview: ExternalEmbedPreview | undefined;
}): React.ReactElement {
  return (
    <>
      {firstEmbedLink &&
        (isLoading ? (
          <div className="flex justify-center py-2">
            <LoadingDotsIcon className="size-6 text-fg-muted" />
          </div>
        ) : (
          preview && <ExternalEmbedView embed={toEmbedExternalView(preview)} />
        ))}
    </>
  );
}

function toEmbedExternalView(preview: ExternalEmbedPreview): app.bsky.embed.external.View {
  return {
    $type: "app.bsky.embed.external#view",
    external: {
      $type: "app.bsky.embed.external#viewExternal",
      uri: preview.uri,
      title: preview.title,
      description: preview.description,
      thumb: preview.thumb,
    },
  };
}
