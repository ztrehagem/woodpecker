import { asDatetimeString } from "@atproto/lex";
import { Collapsible } from "@base-ui/react/collapsible";
import React, { use } from "react";
import { Link } from "react-router";

import Card from "#src/shared/ui/card.tsx";
import { CaretRightIcon } from "#src/shared/ui/icon/index.ts";

import type { FeedViewPost } from "../model/feed-view-post";
import type { Timeline } from "../model/timeline";

export function TimelineView({ feed }: { feed: readonly FeedViewPost[] }): React.ReactElement {
  return (
    <div className="grid grid-cols-1 gap-4">
      {feed.map((post) => (
        <Card key={post.post.uri}>
          <article className="px-5 py-4">
            <img src={post.post.author.avatar} alt="" className="h-10 w-10 rounded-full" />
            <div>
              <Link
                to={`/profile/${post.post.author.handle}`}
                className="font-bold text-inherit hover:underline"
              >
                {post.post.author.displayName}
              </Link>
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
            <Collapsible.Root>
              <Collapsible.Trigger className="group inline-flex cursor-pointer items-center text-xs text-fg-muted">
                Show raw data
                <CaretRightIcon className="size-5 transition-transform duration-100 ease-[ease-out] group-data-panel-open:rotate-90" />
              </Collapsible.Trigger>
              <Collapsible.Panel>
                <pre className="rounded-e-md bg-filling px-5 py-4 text-xs whitespace-pre text-fg-muted">
                  {JSON.stringify(post, null, 2)}
                </pre>
              </Collapsible.Panel>
            </Collapsible.Root>
          </article>
        </Card>
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
