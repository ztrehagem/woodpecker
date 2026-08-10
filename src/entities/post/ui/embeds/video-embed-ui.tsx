import React from "react";

import type { app } from "#src/shared/api/lexicons/index.ts";

export function VideoEmbedUI({ embed }: { embed: app.bsky.embed.video.View }): React.ReactElement {
  const thumbnail = embed.thumbnail;

  return (
    <div className="my-3 overflow-hidden rounded-md border border-filling">
      {thumbnail != null && (
        <img src={thumbnail} alt={embed.alt ?? ""} className="h-40 w-full object-cover" />
      )}
      <div className="px-3 py-2 text-sm text-fg-muted">Video</div>
    </div>
  );
}
