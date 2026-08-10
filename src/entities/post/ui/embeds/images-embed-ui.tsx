import React from "react";

import type { app } from "#src/shared/api/lexicons/index.ts";

export function ImagesEmbedUI({
  embed,
}: {
  embed: app.bsky.embed.images.View;
}): React.ReactElement {
  if (embed.images.length == 1) {
    return (
      <div className="my-3 grid grid-cols-1 grid-rows-1">
        {embed.images.map((image, index) => (
          <a
            key={index}
            href={image.fullsize}
            target="_blank"
            className="relative mx-auto block w-max max-w-full overflow-hidden rounded-md border border-filling"
          >
            <img src={image.thumb} alt={image.alt} className="max-h-90 w-max object-contain" />
          </a>
        ))}
      </div>
    );
  }

  return (
    <div className="my-3 grid gap-2 mobile:grid-cols-2">
      {embed.images.map((image, index) => (
        <a
          key={index}
          href={image.fullsize}
          target="_blank"
          className="relative overflow-hidden rounded-md border border-filling"
        >
          <img src={image.thumb} alt={image.alt} className="h-60 w-full object-cover" />
        </a>
      ))}
    </div>
  );
}
