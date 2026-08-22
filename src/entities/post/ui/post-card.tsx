import { asDatetimeString } from "@atproto/lex";
import { Collapsible } from "@base-ui/react/collapsible";
import React from "react";
import { Link } from "react-router";

import type { app } from "#src/shared/api/lexicons/index.ts";
import { fallbackDisplayName } from "#src/shared/lib/display-name.ts";
import Card from "#src/shared/ui/card.tsx";
import { CaretRightIcon, KeepIcon, RepeatIcon } from "#src/shared/ui/icon/index.ts";
import Tooltip from "#src/shared/ui/tooltip.tsx";

import { isPostRecord } from "../lib/is-post-record";
import { buildPostHref } from "./build-post-href";
import { EmbedView } from "./embeds/embed-view";
import { PostActionBar } from "./post-action/post-action-bar";
import { PostReasonRow } from "./post-reason-row";
import { PostRichText } from "./post-rich-text";
import { timeAgo } from "./time-ago";

export function PostCard({
  postView,
  reason,
  pinned = false,
  preview = false,
}: {
  postView: app.bsky.feed.defs.PostView;
  reason?: app.bsky.feed.defs.FeedViewPost["reason"];
  pinned?: boolean;
  preview?: boolean;
}): React.ReactElement {
  const record = postView.record;

  if (!isPostRecord(record)) {
    return <></>;
  }

  const datetimeString = asDatetimeString(record.createdAt);
  const date = new Date(datetimeString);
  const datetimeLocaleString = date.toLocaleString();

  const link = buildPostHref(postView);

  const displayName = fallbackDisplayName(postView.author.displayName, postView.author.handle);

  return (
    <Card bordered={preview}>
      <article className="relative p-3 text-sm has-[[data-view-post-link]:focus-visible]:bg-highlight tablet:px-5 tablet:py-4">
        {!preview && (
          <Link
            to={link ?? ""}
            aria-label="View post"
            data-view-post-link
            className="absolute inset-0 block"
          ></Link>
        )}

        {(reason || pinned) && <PostReasonBlock reason={reason} pinned={pinned} />}

        <div className="flex gap-2">
          <Link
            to={preview ? {} : `/profile/${postView.author.handle}`}
            className="relative h-10 w-10 shrink-0 overflow-clip rounded-full"
          >
            {postView.author.avatar != null && (
              <img src={postView.author.avatar} alt="" className="size-full" />
            )}
          </Link>

          <div className="grow">
            <div className="flex flex-wrap items-center justify-start gap-x-2">
              <Link
                to={preview ? {} : `/profile/${postView.author.handle}`}
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

            <PostRichText text={record.text} facets={record.facets} />

            {postView.embed && (
              <div className="my-3">
                <EmbedView embed={postView.embed} />
              </div>
            )}

            {!preview && <PostActionBar postView={postView} />}

            {import.meta.env.DEV && (
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
  return <PostReasonRow icon={KeepIcon}>Pinned</PostReasonRow>;
}
function PostReasonBlockRepost({
  reason,
}: {
  reason: app.bsky.feed.defs.ReasonRepost;
}): React.ReactElement {
  return (
    <PostReasonRow icon={RepeatIcon}>
      Reposted by{" "}
      <Link to={`/profile/${reason.by.handle}`} className="relative text-fg-muted hover:underline">
        {fallbackDisplayName(reason.by.displayName, reason.by.handle)}
      </Link>
    </PostReasonRow>
  );
}
