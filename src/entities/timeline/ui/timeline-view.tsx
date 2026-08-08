import type { RichTextSegment } from "@atproto/api";
import { RichText, type RichTextProps } from "@atproto/api";
import { asDatetimeString } from "@atproto/lex";
import { Collapsible } from "@base-ui/react/collapsible";
import React, { use } from "react";
import { Link } from "react-router";

import Card from "#src/shared/ui/card.tsx";
import {
  BookmarkIcon,
  CaretRightIcon,
  LikeIcon,
  QuoteIcon,
  RepeatIcon,
  ReplyIcon,
} from "#src/shared/ui/icon/index.ts";
import Tooltip from "#src/shared/ui/tooltip.tsx";

import type { FeedViewPost } from "../model/feed-view-post";
import type { Timeline } from "../model/timeline";

export function TimelineView({ feed }: { feed: readonly FeedViewPost[] }): React.ReactElement {
  return (
    <div className="grid grid-cols-1 gap-4">
      {feed.map((post) => (
        <PostCard key={post.post.uri} post={post} />
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

function PostCard({ post }: { post: FeedViewPost }): React.ReactElement {
  const datetimeString = asDatetimeString(post.post.record.createdAt as string);
  const date = new Date(datetimeString);
  const datetimeLocaleString = date.toLocaleString();

  const text = "text" in post.post.record ? (post.post.record.text as string) : "";
  const facets =
    "facets" in post.post.record ? (post.post.record.facets as RichTextProps["facets"]) : void 0;
  const richText = new RichText({ text, facets });

  return (
    <Card>
      <article className="px-5 py-4">
        <div className="flex gap-2">
          <img src={post.post.author.avatar} alt="" className="h-10 w-10 shrink-0 rounded-full" />

          <div className="grow">
            <div className="flex flex-wrap items-center justify-start gap-x-2">
              <Link
                to={`/profile/${post.post.author.handle}`}
                className="font-bold text-inherit hover:underline"
              >
                {post.post.author.displayName}
              </Link>

              <div className="text-xs">@{post.post.author.handle}</div>

              <Tooltip side="top" tooltip={<span className="text-xs">{datetimeLocaleString}</span>}>
                <time dateTime={datetimeString} className="flex items-center text-xs text-fg-muted">
                  {timeAgo(date)}
                </time>
              </Tooltip>
            </div>

            <p className="font-light whitespace-pre-line">
              {Array.from(richText.segments()).map((segment, index) => (
                <RichTextSegmentView key={index} segment={segment} />
              ))}
            </p>

            <dl className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm font-light text-fg-muted">
              <div className="flex items-center gap-x-1">
                <dt>
                  <ReplyIcon aria-label="Replies" className="size-4" />
                </dt>
                <dd>{post.post.replyCount}</dd>
              </div>

              <div className="flex items-center gap-x-1">
                <dt>
                  <RepeatIcon aria-label="Reposts" className="size-4" />
                </dt>
                <dd>{post.post.repostCount}</dd>
              </div>

              <div className="flex items-center gap-x-1">
                <dt>
                  <QuoteIcon aria-label="Quotes" className="size-4" />
                </dt>
                <dd>{post.post.quoteCount}</dd>
              </div>

              <div className="flex items-center gap-x-1">
                <dt>
                  <LikeIcon aria-label="Likes" className="size-4" />
                </dt>
                <dd>{post.post.likeCount}</dd>
              </div>

              <div className="flex items-center gap-x-1">
                <dt>
                  <BookmarkIcon aria-label="Bookmarks" className="size-4" />
                </dt>
                <dd>{post.post.bookmarkCount}</dd>
              </div>
            </dl>

            <Collapsible.Root className="flex flex-col">
              <Collapsible.Trigger className="group inline-flex cursor-pointer items-center text-2xs text-fg-muted">
                Show raw data
                <CaretRightIcon className="size-5 transition-transform duration-100 ease-[ease-out] group-data-panel-open:rotate-90" />
              </Collapsible.Trigger>
              <Collapsible.Panel>
                <pre className="rounded-e-md bg-filling text-2xs whitespace-pre text-fg-muted">
                  {JSON.stringify(post, null, 2)}
                </pre>
              </Collapsible.Panel>
            </Collapsible.Root>
          </div>
        </div>
      </article>
    </Card>
  );
}

function RichTextSegmentView({ segment }: { segment: RichTextSegment }): React.ReactElement {
  switch (true) {
    case segment.isLink():
      return (
        <a href={segment.link?.uri} target="_blank">
          {segment.text}
        </a>
      );
    case segment.isMention():
      return <Link to={`/profile/${segment.mention?.did}`}>{segment.text}</Link>;
    case segment.isTag():
      return <>{segment.text}</>;
    default:
      return <>{segment.text}</>;
  }
}

function timeAgo(date: Date, locale: Intl.LocalesArgument = navigator.languages): string {
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });
  const now = new Date();
  const diffInSeconds = Math.floor((date.getTime() - now.getTime()) / 1000);

  // 時間単位の判定用データ
  const units = [
    { name: "year", seconds: 31536000 },
    { name: "month", seconds: 2592000 },
    { name: "week", seconds: 604800 },
    { name: "day", seconds: 86400 },
    { name: "hour", seconds: 3600 },
    { name: "minute", seconds: 60 },
  ] as const;

  for (const u of units) {
    if (Math.abs(diffInSeconds) >= u.seconds) {
      const value = Math.round(diffInSeconds / u.seconds);
      return rtf.format(value, u.name);
    }
  }

  return rtf.format(diffInSeconds, "second");
}
