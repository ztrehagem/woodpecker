import React from "react";

import { PostCard } from "#src/entities/post/@x/timeline.ts";
import type { app } from "#src/shared/api/lexicons/index.ts";

export function TimelineUI({
  feed,
}: {
  feed: readonly app.bsky.feed.defs.FeedViewPost[];
}): React.ReactElement {
  return (
    <div className="grid grid-cols-1 gap-4">
      {feed
        .filter((post) => post.reply?.parent == null)
        .map((post) => (
          <PostCard key={post.post.uri} postView={post.post} reason={post.reason} />
        ))}
    </div>
  );
}
