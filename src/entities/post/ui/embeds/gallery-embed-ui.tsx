import React from "react";

import type { app } from "#src/shared/api/lexicons/index.ts";

export function GalleryEmbedUI({
  embed,
}: {
  embed: app.bsky.embed.gallery.View;
}): React.ReactElement {
  const items = embed.items as Array<app.bsky.embed.gallery.ViewImage>;

  return (
    <div className="grid w-full grid-cols-1 grid-rows-1 overflow-x-auto">
      <div className="grid w-max auto-cols-fr grid-flow-col grid-rows-1 gap-1">
        {items.map((image, index) => (
          <a
            key={index}
            href={image.fullsize}
            target="_blank"
            className="relative overflow-hidden rounded-md border border-filling"
          >
            <img src={image.thumbnail} alt={image.alt} className="h-60 w-60 object-cover" />
          </a>
        ))}
      </div>
    </div>
  );
}
