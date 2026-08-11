import { RichText } from "@atproto/api";
import { asDatetimeString } from "@atproto/lex";
import React from "react";
import { Link } from "react-router";

import type { app } from "#src/shared/api/lexicons/index.ts";
import Tooltip from "#src/shared/ui/tooltip.tsx";

import { buildPostHref } from "../build-post-href";
import { fallbackDisplayName } from "../display-name";
import { RichTextSegmentUI } from "../rich-text-segment-ui";
import { timeAgo } from "../time-ago";

export function RecordEmbedUI({
  embed,
  renderEmbed,
}: {
  embed: app.bsky.embed.record.View;
  renderEmbed: (embed: NonNullable<app.bsky.feed.defs.PostView["embed"]>) => React.ReactElement;
}): React.ReactElement {
  const { record } = embed;

  switch (record.$type) {
    case "app.bsky.embed.record#viewRecord":
      return (
        <RecordEmbedPostView
          record={record as app.bsky.embed.record.ViewRecord}
          renderEmbed={renderEmbed}
        />
      );
    case "app.bsky.embed.record#viewNotFound":
    case "app.bsky.embed.record#viewBlocked":
    case "app.bsky.embed.record#viewDetached":
      return <></>;
    default:
      return import.meta.env.DEV ? (
        <pre className="text-2xs text-fg-muted">{JSON.stringify(record, null, 2)}</pre>
      ) : (
        <></>
      );
  }
}

function RecordEmbedPostView({
  record,
  renderEmbed,
}: {
  record: app.bsky.embed.record.ViewRecord;
  renderEmbed: (embed: NonNullable<app.bsky.feed.defs.PostView["embed"]>) => React.ReactElement;
}): React.ReactElement {
  const post =
    record.value.$type === "app.bsky.feed.post" ? (record.value as app.bsky.feed.post.Main) : null;

  if (!post) {
    return <RecordEmbedUnknownView />;
  }

  const datetimeString = asDatetimeString(post.createdAt);
  const date = new Date(datetimeString);
  const datetimeLocaleString = date.toLocaleString();

  const link = buildPostHref(record);

  const displayName = fallbackDisplayName(record.author.displayName, record.author.handle);

  const richText = new RichText({ text: post.text, facets: post.facets });

  return (
    <article className="relative rounded-md border border-highlight px-3 py-2">
      <Link
        to={link ?? ""}
        aria-label="View post"
        data-view-post-link
        className="absolute inset-0 block"
      ></Link>

      <div className="flex items-start gap-2">
        <Link
          to={`/profile/${record.author.handle}`}
          className="relative h-8 w-8 shrink-0 overflow-clip rounded-full"
        >
          <img src={record.author.avatar} alt="" className="size-full" />
        </Link>

        <div className="min-w-0 grow">
          <div className="flex flex-wrap items-center gap-x-2">
            <Link
              to={`/profile/${record.author.handle}`}
              className="relative text-sm font-semibold wrap-anywhere text-inherit hover:underline"
            >
              {displayName}
            </Link>

            <div className="text-xs wrap-anywhere text-fg-muted">@{record.author.handle}</div>

            {date != null && datetimeString != null && datetimeLocaleString != null && (
              <Tooltip
                side="top"
                className="relative"
                tooltip={<span className="text-xs">{datetimeLocaleString}</span>}
              >
                <time dateTime={datetimeString} className="flex items-center text-xs text-fg-muted">
                  {timeAgo(date)}
                </time>
              </Tooltip>
            )}
          </div>

          {post.text.length > 0 && (
            <p className="mt-1 text-sm whitespace-pre-line">
              {Array.from(richText.segments()).map((segment, index) => (
                <RichTextSegmentUI key={index} segment={segment} />
              ))}
            </p>
          )}

          {record.embeds?.map((recordEmbed, index) => (
            <div className="mt-3" key={index}>
              {renderEmbed(recordEmbed as NonNullable<app.bsky.feed.defs.PostView["embed"]>)}
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}

function RecordEmbedUnknownView(): React.ReactElement {
  return (
    <div className="rounded-md border border-filling px-3 py-2 text-sm text-fg-muted">
      Embedded record
    </div>
  );
}
