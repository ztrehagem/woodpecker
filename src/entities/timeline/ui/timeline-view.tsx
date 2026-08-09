import React, { use } from "react";

import { PostCard } from "#src/entities/post/@x/timeline.ts";

import type { FeedViewPost } from "../model/feed-view-post";
import type { Timeline } from "../model/timeline";

export function TimelineView({ feed }: { feed: readonly FeedViewPost[] }): React.ReactElement {
  return (
    <div className="grid grid-cols-1 gap-4">
      {feed.map((post) => (
        <PostCard key={post.post.uri} post={post.post} />
      ))}
    </div>
  );
}

TimelineView.Promise = function ({
  timeline: timelinePromise,
}: {
  timeline: Promise<Timeline>;
}): React.ReactElement {
  const timeline = use(timelinePromise);

  return <TimelineView feed={timeline.feed} />;
};
