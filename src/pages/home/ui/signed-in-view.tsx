import React, { Suspense, use } from "react";

import { useCachedClient, type Timeline } from "#src/features/auth/index.ts";
import Container from "#src/shared/ui/container.tsx";
import ErrorBoundary from "#src/shared/ui/error-boundary.ts";
import { LoadingBoxesIcon } from "#src/shared/ui/icon/index.ts";

import ProfileCard from "./profile-card";

export default function SignedInView(): React.ReactElement {
  const client = useCachedClient();

  return (
    <ErrorBoundary fallback={<div>Failed to load</div>}>
      <Suspense
        fallback={
          <div className="grid grow grid-cols-1 grid-rows-1 place-items-center px-5 py-4">
            <LoadingBoxesIcon />
          </div>
        }
      >
        <div className="py-4">
          <Container>
            <ProfileCard.Promise profile={client.getProfile()} />
          </Container>
        </div>

        <div className="py-4">
          <Container>
            <h2 className="mb-4 text-2xl font-bold">Timeline</h2>
            <TimelineView.Promise timeline={client.getTimeline()} />
          </Container>
        </div>
      </Suspense>
    </ErrorBoundary>
  );
}

function TimelineView({ timeline }: { timeline: Timeline }): React.ReactElement {
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
            <time dateTime={post.post.indexedAt}>
              {new Date(post.post.indexedAt).toLocaleString()}
            </time>
          </div>
          <p>{post.post.record.text as string}</p>
          <pre className="text-xs whitespace-pre">{JSON.stringify(post, null, 2)}</pre>
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
