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

import type { Post } from "../model/post";
import { EmbedView } from "./embed-view";
import { RichTextSegmentView } from "./rich-text-segment-view";
import { timeAgo } from "./time-ago";

export function DetailedPostCard({ post }: { post: Post }): React.ReactElement {
  const datetimeString = asDatetimeString(post.record.createdAt as string);
  const date = new Date(datetimeString);
  const datetimeLocaleString = date.toLocaleString();

  const displayName =
    post.author.displayName == null || post.author.displayName == ""
      ? post.author.handle
      : post.author.displayName;

  const text = "text" in post.record ? (post.record.text as string) : "";
  const facets = "facets" in post.record ? (post.record.facets as RichTextProps["facets"]) : void 0;
  const richText = new RichText({ text, facets });

  return (
    <Card>
      <article className="relative px-5 py-4">
        <div className="flex gap-2">
          <Link
            to={`/profile/${post.author.handle}`}
            className="h-10 w-10 shrink-0 overflow-clip rounded-full"
          >
            <img src={post.author.avatar} alt="" className="size-full" />
          </Link>

          <div className="flex grow flex-col">
            <Link
              to={`/profile/${post.author.handle}`}
              className="relative font-bold wrap-anywhere text-inherit hover:underline"
            >
              {displayName}
            </Link>

            <div className="text-xs wrap-anywhere">@{post.author.handle}</div>
          </div>
        </div>

        <div className="mt-1 flex flex-col gap-1">
          <p className="whitespace-pre-line">
            {Array.from(richText.segments()).map((segment, index) => (
              <RichTextSegmentView key={index} segment={segment} />
            ))}
          </p>

          {post.embed && <EmbedView embed={post.embed} />}

          <time
            dateTime={datetimeString}
            className="flex items-center gap-x-1 text-xs text-fg-muted"
          >
            <span>{timeAgo(date)}</span>
            <span>&bull;</span>
            <span className="text-xs">{datetimeLocaleString}</span>
          </time>

          <dl className="flex flex-wrap gap-x-4 gap-y-1 text-sm font-light text-fg-muted">
            <div className="flex items-center gap-x-1">
              <dt>
                <ReplyIcon aria-label="Replies" className="size-4" />
              </dt>
              <dd>{post.replyCount}</dd>
            </div>

            <div className="flex items-center gap-x-1">
              <dt>
                <RepeatIcon aria-label="Reposts" className="size-4" />
              </dt>
              <dd>{post.repostCount}</dd>
            </div>

            <div className="flex items-center gap-x-1">
              <dt>
                <QuoteIcon aria-label="Quotes" className="size-4" />
              </dt>
              <dd>{post.quoteCount}</dd>
            </div>

            <div className="flex items-center gap-x-1">
              <dt>
                <LikeIcon aria-label="Likes" className="size-4" />
              </dt>
              <dd>{post.likeCount}</dd>
            </div>

            <div className="flex items-center gap-x-1">
              <dt>
                <BookmarkIcon aria-label="Bookmarks" className="size-4" />
              </dt>
              <dd>{post.bookmarkCount}</dd>
            </div>
          </dl>

          {import.meta.env.DEV && (
            <Collapsible.Root className="flex flex-col items-start">
              <Collapsible.Trigger className="group relative inline-flex cursor-pointer items-center text-2xs text-fg-muted">
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
      </article>
    </Card>
  );
}
