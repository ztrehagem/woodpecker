import React from "react";

import type { app } from "#src/shared/api/lexicons/index.ts";

export function ExternalEmbedUI({
  embed,
}: {
  embed: app.bsky.embed.external.View;
}): React.ReactElement {
  const { external } = embed;
  const url = getUrlSafe(external.uri);
  const thumb = external.thumb;

  if (!url) {
    return <></>;
  }

  return (
    <div className="relative flex flex-col overflow-hidden rounded-md border border-filling bg-highlight tablet:flex-row">
      <div className="flex flex-1 flex-col gap-1 px-3 py-2">
        <a
          href={url.toString()}
          target="_blank"
          className="text-sm font-semibold wrap-anywhere after:absolute after:inset-0 after:block"
        >
          {external.title}
        </a>

        {external.description && (
          <div className="text-xs wrap-anywhere text-fg-muted">{external.description}</div>
        )}

        <div className="mt-auto text-2xs wrap-anywhere text-fg-muted">{url.hostname}</div>
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

function getUrlSafe(url: string): URL | null {
  try {
    return new URL(url);
  } catch {
    return null;
  }
}
