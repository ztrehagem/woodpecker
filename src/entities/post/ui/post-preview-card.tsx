import { asDatetimeString } from "@atproto/lex";
import React from "react";

import { BotBadge } from "#src/entities/profile/@x/post.ts";
import type { app } from "#src/shared/api/lexicons/index.ts";
import { fallbackDisplayName } from "#src/shared/lib/display-name.ts";
import { getPostLabelPolicy } from "#src/shared/lib/label-policy.ts";
import Card from "#src/shared/ui/card.tsx";
import { CollapsibleWarning, HiddenContentNotice } from "#src/shared/ui/content-warning.tsx";
import Tooltip from "#src/shared/ui/tooltip.tsx";

import { isPostRecord } from "../lib/is-post-record";
import { EmbedView } from "./embeds/embed-view";
import { PostRichText } from "./post-rich-text";
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

  const labelPolicy = getPostLabelPolicy(postView);

  if (labelPolicy.policy === "hidden") {
    return (
      <Card bordered>
        <div className="p-3 text-sm tablet:px-5 tablet:py-4">
          <HiddenContentNotice reason="This post has been hidden due to a moderation label." />
        </div>
      </Card>
    );
  }

  const datetimeString = asDatetimeString(record.createdAt);
  const date = new Date(datetimeString);
  const datetimeLocaleString = date.toLocaleString();

  const displayName = fallbackDisplayName(postView.author.displayName, postView.author.handle);

  const richTextView = <PostRichText text={record.text} facets={record.facets} />;

  const embedView = postView.embed && <EmbedView embed={postView.embed} skipRecordEmbed />;

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

          <BotBadge postView={postView} />

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

        <div className="mt-1 flex flex-col gap-2">
          {labelPolicy.policy === "warned" ? (
            <CollapsibleWarning reason={labelPolicy.reasonText}>
              {richTextView}
              {embedView}
            </CollapsibleWarning>
          ) : (
            <>
              {richTextView}

              {embedView &&
                (labelPolicy.policy === "media-warned" ? (
                  <CollapsibleWarning reason={labelPolicy.reasonText}>
                    {embedView}
                  </CollapsibleWarning>
                ) : (
                  embedView
                ))}
            </>
          )}
        </div>
      </article>
    </Card>
  );
}
