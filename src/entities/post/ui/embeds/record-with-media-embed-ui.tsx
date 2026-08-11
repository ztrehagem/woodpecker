import React from "react";

import type { app } from "#src/shared/api/lexicons/index.ts";

export function RecordWithMediaEmbedUI({
  embed,
}: {
  embed: app.bsky.embed.recordWithMedia.View;
}): React.ReactElement {
  return (
    <div className="rounded-md border border-filling px-3 py-2">
      <div className="text-sm font-semibold">Embedded post with media</div>
      <div className="mt-1 text-xs text-fg-muted">{embed.record.$type ?? "embedded record"}</div>
    </div>
  );
}
