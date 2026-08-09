import { RichText, type RichTextProps } from "@atproto/api";
import { asDatetimeString } from "@atproto/lex";
import { Collapsible } from "@base-ui/react/collapsible";
import React from "react";
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
import { EmbedView } from "./embed-view";
import { RichTextSegmentView } from "./rich-text-segment-view";
import { timeAgo } from "./time-ago";

export function PostCard({ post }: { post: FeedViewPost }): React.ReactElement {
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
                <Link to={`/post/${encodeURIComponent(post.post.uri)}`} className="hover:underline">
                  <time
                    dateTime={datetimeString}
                    className="flex items-center text-xs text-fg-muted"
                  >
                    {timeAgo(date)}
                  </time>
                </Link>
              </Tooltip>
            </div>

            <p className="font-light whitespace-pre-line">
              {Array.from(richText.segments()).map((segment, index) => (
                <RichTextSegmentView key={index} segment={segment} />
              ))}
            </p>

            {post.post.embed && <EmbedView embed={post.post.embed} />}

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

            {import.meta.env.DEV && (
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
            )}
          </div>
        </div>
      </article>
    </Card>
  );
}
