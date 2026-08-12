import React from "react";

import { PostCard } from "#src/entities/post/@x/timeline.ts";
import type { app } from "#src/shared/api/lexicons/index.ts";

export function TimelineUI({
  feed,
  all = false,
}: {
  feed: readonly app.bsky.feed.defs.FeedViewPost[];
  all?: boolean;
}): React.ReactElement {
  if (!all) {
    feed = feed.filter((post) => post.reply?.parent == null);
  }

  return (
    <div className="grid grid-cols-1 gap-2 tablet:gap-4">
      {feed.map((post) => (
        <PostCard key={post.post.uri} postView={post.post} reason={post.reason} />
      ))}
    </div>
  );
}
