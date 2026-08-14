import { RichText } from "@atproto/api";
import { asDatetimeString } from "@atproto/lex";
import { Collapsible } from "@base-ui/react/collapsible";
import React from "react";
import { Link } from "react-router";

import type { app } from "#src/shared/api/lexicons/index.ts";
import { fallbackDisplayName } from "#src/shared/lib/display-name.ts";
import Card from "#src/shared/ui/card.tsx";
import { CaretRightIcon, KeepIcon, RepeatIcon } from "#src/shared/ui/icon/index.ts";
import Tooltip from "#src/shared/ui/tooltip.tsx";

import { buildPostHref } from "./build-post-href";
import { EmbedUI } from "./embeds/embed-ui";
import { PostActionBar } from "./post-action/post-action-bar";
import { RichTextSegmentUI } from "./rich-text-segment-ui";
import { timeAgo } from "./time-ago";

export function PostCard({
  postView,
  reason,
  pinned = false,
}: {
  postView: app.bsky.feed.defs.PostView;
  reason?: app.bsky.feed.defs.FeedViewPost["reason"];
  pinned?: boolean;
}): React.ReactElement {
  const post =
    postView.record.$type === "app.bsky.feed.post"
      ? (postView.record as app.bsky.feed.post.Main)
      : null;

  if (!post) {
    return <></>;
  }

  const datetimeString = asDatetimeString(post.createdAt);
  const date = new Date(datetimeString);
  const datetimeLocaleString = date.toLocaleString();

  const link = buildPostHref(postView);

  const displayName = fallbackDisplayName(postView.author.displayName, postView.author.handle);

  const richText = new RichText({ text: post.text, facets: post.facets });

  return (
    <Card>
      <article className="relative p-3 text-sm has-[[data-view-post-link]:focus-visible]:bg-highlight tablet:px-5 tablet:py-4">
        <Link
          to={link ?? ""}
          aria-label="View post"
          data-view-post-link
          className="absolute inset-0 block"
        ></Link>

        {(reason || pinned) && <PostReasonBlock reason={reason} pinned={pinned} />}

        <div className="flex gap-2">
          <Link
            to={`/profile/${postView.author.handle}`}
            className="relative h-10 w-10 shrink-0 overflow-clip rounded-full"
          >
            {postView.author.avatar != null && (
              <img src={postView.author.avatar} alt="" className="size-full" />
            )}
          </Link>

          <div className="grow">
            <div className="flex flex-wrap items-center justify-start gap-x-2">
              <Link
                to={`/profile/${postView.author.handle}`}
                className="relative font-bold wrap-anywhere text-inherit hover:underline"
              >
                {displayName}
              </Link>

              <div className="text-xs wrap-anywhere text-fg-muted">@{postView.author.handle}</div>

              <Tooltip
                side="top"
                className="tablet:relative"
                tooltip={<span className="text-xs">{datetimeLocaleString}</span>}
              >
                <time dateTime={datetimeString} className="flex items-center text-xs text-fg-muted">
                  {timeAgo(date)}
                </time>
              </Tooltip>
            </div>

            {post.text.length > 0 && (
              <p className="whitespace-pre-line">
                {Array.from(richText.segments()).map((segment, index) => (
                  <RichTextSegmentUI key={index} segment={segment} />
                ))}
              </p>
            )}

            {postView.embed && (
              <div className="my-3">
                <EmbedUI embed={postView.embed} />
              </div>
            )}

            <PostActionBar postView={postView} />

            {import.meta.env.DEV && import.meta.env.DEBUG != null && (
              <Collapsible.Root className="flex flex-col items-start">
                <Collapsible.Trigger className="group relative inline-flex cursor-pointer items-center text-2xs text-fg-muted">
                  Show raw data
                  <CaretRightIcon className="size-5 transition-transform duration-100 ease-[ease-out] group-data-panel-open:rotate-90" />
                </Collapsible.Trigger>
                <Collapsible.Panel>
                  <pre className="rounded-e-md bg-filling text-2xs whitespace-pre text-fg-muted">
                    {JSON.stringify(postView, null, 2)}
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

function PostReasonBlock({
  reason,
  pinned,
}: {
  reason: app.bsky.feed.defs.FeedViewPost["reason"];
  pinned: boolean;
}): React.ReactElement | null {
  if (pinned) {
    return <PostReasonBlockPinned />;
  }

  switch (reason?.$type) {
    case "app.bsky.feed.defs#reasonRepost":
      return <PostReasonBlockRepost reason={reason as app.bsky.feed.defs.ReasonRepost} />;
    case "app.bsky.feed.defs#reasonPin":
      return <PostReasonBlockPinned />;
    default:
      return null;
  }
}

function PostReasonBlockPinned(): React.ReactElement {
  return (
    <div className="mb-2 flex items-center gap-x-1 text-2xs text-fg-muted">
      <KeepIcon className="size-4" />
      <span>Pinned</span>
    </div>
  );
}
function PostReasonBlockRepost({
  reason,
}: {
  reason: app.bsky.feed.defs.ReasonRepost;
}): React.ReactElement {
  return (
    <div className="mb-2 flex items-center gap-x-1 text-2xs text-fg-muted">
      <RepeatIcon className="size-4" />
      <span>
        <span>Reposted by </span>
        <Link
          to={`/profile/${reason.by.handle}`}
          className="relative text-fg-muted hover:underline"
        >
          {fallbackDisplayName(reason.by.displayName, reason.by.handle)}
        </Link>
      </span>
    </div>
  );
}
