import React from "react";

import type { app } from "#src/shared/api/lexicons/index.ts";

export function ExternalEmbedView({
  embed,
}: {
  embed: app.bsky.embed.external.View;
}): React.ReactElement {
  const { external } = embed;
  const thumb = external.thumb;

  return (
    <div className="relative my-3 flex flex-col overflow-hidden rounded-md border border-filling bg-highlight tablet:flex-row">
      <div className="flex flex-1 flex-col gap-1 px-3 py-2">
        <a
          href={external.uri}
          target="_blank"
          className="text-sm font-semibold wrap-anywhere after:absolute after:inset-0 after:block"
        >
          {external.title}
        </a>

        {external.description && (
          <div className="text-xs wrap-anywhere text-fg-muted">{external.description}</div>
        )}

        <div className="mt-auto text-2xs wrap-anywhere text-fg-muted">
          {new URL(external.uri).hostname}
        </div>
      </div>
      {thumb != null && (
        <img
          src={thumb}
          alt=""
          className="aspect-video shrink-0 object-cover tablet:min-h-24 tablet:w-48"
        />
      )}
    </div>
  );
}
