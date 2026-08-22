import { asDatetimeString } from "@atproto/lex";
import React from "react";
import { Link } from "react-router";

import {
  buildPostHref,
  isPostRecord,
  PostReasonRow,
  PostRichText,
  timeAgo,
} from "#src/entities/post/index.ts";
import type { app } from "#src/shared/api/lexicons/index.ts";
import { fallbackDisplayName } from "#src/shared/lib/display-name.ts";
import Card from "#src/shared/ui/card.tsx";
import { AtIcon, QuoteIcon, ReplyIcon } from "#src/shared/ui/icon/index.ts";
import Tooltip from "#src/shared/ui/tooltip.tsx";

export function NotificationPostCard({
  notification,
}: {
  notification: app.bsky.notification.listNotifications.Notification;
}): React.ReactElement {
  const record = notification.record;

  if (!isPostRecord(record)) {
    return <></>;
  }

  const datetimeString = asDatetimeString(record.createdAt);
  const date = new Date(datetimeString);
  const datetimeLocaleString = date.toLocaleString();

  const link = buildPostHref({
    uri: notification.uri,
    author: { did: notification.author.did, handle: notification.author.handle },
  });

  const displayName = fallbackDisplayName(
    notification.author.displayName,
    notification.author.handle,
  );

  return (
    <Card>
      <article className="relative p-3 text-sm has-[[data-view-post-link]:focus-visible]:bg-highlight tablet:px-5 tablet:py-4">
        {link != null && (
          <Link
            to={link}
            aria-label="View post"
            data-view-post-link
            className="absolute inset-0 block"
          ></Link>
        )}

        <NotificationReasonBlock reason={notification.reason} />

        <div className="flex gap-2">
          <Link
            to={`/profile/${notification.author.handle}`}
            className="relative size-10 shrink-0 overflow-clip rounded-full"
          >
            {notification.author.avatar != null && (
              <img src={notification.author.avatar} alt="" className="size-full" />
            )}
          </Link>

          <div className="grow">
            <div className="flex flex-wrap items-baseline justify-start gap-x-2">
              <Link
                to={`/profile/${notification.author.handle}`}
                className="relative font-bold wrap-anywhere text-inherit hover:underline"
              >
                {displayName}
              </Link>

              <div className="text-xs wrap-anywhere text-fg-muted">
                @{notification.author.handle}
              </div>

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
          </div>
        </div>
      </article>
    </Card>
  );
}

function NotificationReasonBlock({
  reason,
}: {
  reason: app.bsky.notification.listNotifications.Notification["reason"];
}): React.ReactElement | null {
  switch (reason) {
    case "reply":
      return <PostReasonRow icon={ReplyIcon}>Replied to your post</PostReasonRow>;
    case "quote":
      return <PostReasonRow icon={QuoteIcon}>Quoted your post</PostReasonRow>;
    case "mention":
      return <PostReasonRow icon={AtIcon}>Mentioned you</PostReasonRow>;
    default:
      return null;
  }
}
