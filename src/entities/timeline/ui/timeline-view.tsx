import { asDatetimeString } from "@atproto/lex";
import React, { use } from "react";

import type { Timeline } from "../model/timeline";

export function TimelineView({ timeline }: { timeline: Timeline }): React.ReactElement {
  return (
    <div className="grid grid-cols-1 gap-4">
      {timeline.feed.map((post) => (
        <article key={post.post.uri}>
          <img src={post.post.author.avatar} alt="" className="h-10 w-10 rounded-full" />
          <div>
            <span>{post.post.author.displayName}</span>
            <span>&emsp;@{post.post.author.handle}</span>
          </div>
          <div>
            <time dateTime={asDatetimeString(post.post.record.createdAt as string)}>
              {new Date(asDatetimeString(post.post.record.createdAt as string)).toLocaleString()}
            </time>
          </div>
          <p>{post.post.record.text as string}</p>
          <dl className="flex flex-wrap gap-x-4 gap-y-1">
            <div className="flex gap-x-1">
              <dd>{post.post.replyCount}</dd>
              <dt>Replies</dt>
            </div>
            <div className="flex gap-x-1">
              <dd>{post.post.repostCount}</dd>
              <dt>Reposts</dt>
            </div>
            <div className="flex gap-x-1">
              <dd>{post.post.quoteCount}</dd>
              <dt>Quotes</dt>
            </div>
            <div className="flex gap-x-1">
              <dd>{post.post.likeCount}</dd>
              <dt>Likes</dt>
            </div>
            <div className="flex gap-x-1">
              <dd>{post.post.bookmarkCount}</dd>
              <dt>Bookmarks</dt>
            </div>
          </dl>
          <pre className="text-xs whitespace-pre">{JSON.stringify(post, null, 2)}</pre>
        </article>
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

  return <TimelineView timeline={timeline} />;
};
