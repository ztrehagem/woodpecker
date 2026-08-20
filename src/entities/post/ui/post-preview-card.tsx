import { RichText } from "@atproto/api";
import { asDatetimeString } from "@atproto/lex";
import React from "react";

import type { app } from "#src/shared/api/lexicons/index.ts";
import { fallbackDisplayName } from "#src/shared/lib/display-name.ts";
import Card from "#src/shared/ui/card.tsx";
import Tooltip from "#src/shared/ui/tooltip.tsx";

import { isPostRecord } from "../lib/is-post-record";
import { EmbedView } from "./embeds/embed-view";
import { RichTextSegmentView } from "./rich-text-segment-view";
import { timeAgo } from "./time-ago";

export function PostPreviewCard({
  postView,
}: {
  postView: app.bsky.feed.defs.PostView;
}): React.ReactElement {
  const record = postView.record;

  if (!isPostRecord(record)) {
    return <></>;
  }

  const datetimeString = asDatetimeString(record.createdAt);
  const date = new Date(datetimeString);
  const datetimeLocaleString = date.toLocaleString();

  const displayName = fallbackDisplayName(postView.author.displayName, postView.author.handle);

  const richText = new RichText({ text: record.text, facets: record.facets });

  return (
    <Card bordered>
      <article className="relative p-3 text-sm has-[[data-view-post-link]:focus-visible]:bg-highlight tablet:px-5 tablet:py-4">
        <div className="flex flex-wrap items-center justify-start gap-x-2">
          <span className="relative h-4 w-4 shrink-0 overflow-clip rounded-full">
            {postView.author.avatar != null && (
              <img src={postView.author.avatar} alt="" className="size-full" />
            )}
          </span>

          <span className="relative font-bold wrap-anywhere text-inherit hover:underline">
            {displayName}
          </span>

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

        {record.text.length > 0 && (
          <p className="mt-1 whitespace-pre-line">
            {Array.from(richText.segments()).map((segment, index) => (
              <RichTextSegmentView key={index} segment={segment} />
            ))}
          </p>
        )}

        {postView.embed && (
          <div className="not-empty:my-3">
            <EmbedView embed={postView.embed} skipRecordEmbed />
          </div>
        )}
      </article>
    </Card>
  );
}
