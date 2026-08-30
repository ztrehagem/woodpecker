import { asDatetimeString, type LexMap } from "@atproto/lex";
import { Collapsible } from "@base-ui/react/collapsible";
import React from "react";
import { Link } from "react-router";

import { buildPostHref, timeAgo } from "#src/entities/post/index.ts";
import { FollowProfileButton } from "#src/entities/profile/index.ts";
import type { app } from "#src/shared/api/lexicons/index.ts";
import { fallbackDisplayName } from "#src/shared/lib/display-name.ts";
import Card from "#src/shared/ui/card.tsx";
import {
  CaretRightIcon,
  FavoriteIcon,
  PersonAddIcon,
  RepeatIcon,
} from "#src/shared/ui/icon/index.ts";
import Tooltip from "#src/shared/ui/tooltip.tsx";

export function NotificationActionCard({
  notification,
}: {
  notification: app.bsky.notification.listNotifications.Notification;
}): React.ReactElement {
  const actorName = fallbackDisplayName(
    notification.author.displayName,
    notification.author.handle,
  );

  const datetimeString = asDatetimeString(notification.record.createdAt);
  const date = new Date(datetimeString);
  const datetimeLocaleString = date.toLocaleString();

  const link = getActionLink(notification);

  return (
    <Card>
      <article className="relative p-3 text-sm tablet:px-5 tablet:py-4">
        {link != null && (
          <Link
            to={link}
            aria-label="View post"
            data-view-post-link
            className="absolute inset-0 block"
          ></Link>
        )}

        <div className="flex gap-4">
          <div className="flex size-6 shrink-0 items-center justify-center">
            <ActionIcon reason={notification.reason} />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <Link
                to={`/profile/${notification.author.handle}`}
                className="relative size-6 shrink-0 overflow-clip rounded-full"
              >
                {notification.author.avatar != null && (
                  <img src={notification.author.avatar} alt="" className="size-full" />
                )}
              </Link>

              <p className="flex flex-wrap items-baseline justify-start gap-x-2">
                <Link
                  to={`/profile/${notification.author.handle}`}
                  className="relative font-bold wrap-anywhere text-inherit hover:underline"
                >
                  {actorName}
                </Link>

                <span>{getActionMessage(notification.reason)}</span>

                <Tooltip
                  side="top"
                  className="tablet:relative"
                  tooltip={<span className="text-xs">{datetimeLocaleString}</span>}
                >
                  <time
                    dateTime={datetimeString}
                    className="flex items-center text-xs text-fg-muted"
                  >
                    {timeAgo(date)}
                  </time>
                </Tooltip>
              </p>
            </div>

            {notification.reason == "follow" && (
              <div className="mt-2">
                <FollowProfileButton profile={notification.author} />
              </div>
            )}

            {/* <pre className="mt-2 text-2xs text-fg-muted">
              {JSON.stringify(notification, null, 2)}
            </pre> */}
          </div>
        </div>

        {import.meta.env.DEV && (
          <Collapsible.Root className="mt-1 flex flex-col items-start">
            <Collapsible.Trigger className="group relative inline-flex cursor-pointer items-center text-2xs text-fg-muted">
              Show raw data
              <CaretRightIcon className="size-5 transition-transform duration-100 ease-[ease-out] group-data-panel-open:rotate-90" />
            </Collapsible.Trigger>
            <Collapsible.Panel>
              <pre className="rounded-e-md bg-filling text-2xs whitespace-pre text-fg-muted">
                {JSON.stringify(notification, null, 2)}
              </pre>
            </Collapsible.Panel>
          </Collapsible.Root>
        )}
      </article>
    </Card>
  );
}

function ActionIcon({
  reason,
}: {
  reason: app.bsky.notification.listNotifications.Notification["reason"];
}): React.ReactElement {
  switch (reason) {
    case "like":
    case "like-via-repost":
      return <FavoriteIcon className="text-fg-like" />;
    case "repost":
    case "repost-via-repost":
      return <RepeatIcon className="text-fg-repost" />;
    case "follow":
      return <PersonAddIcon className="text-fg-link" />;
    default:
      return <></>;
  }
}

function getActionLink(
  notification: app.bsky.notification.listNotifications.Notification,
): string | null {
  switch (notification.reason) {
    case "like":
    case "repost":
      return notification.reasonSubject != null
        ? buildPostHref({ uri: notification.reasonSubject })
        : null;
    case "like-via-repost":
      return isLikeRecord(notification.record)
        ? buildPostHref({ uri: notification.record.subject.uri })
        : null;
    case "repost-via-repost":
      return isRepostRecord(notification.record)
        ? buildPostHref({ uri: notification.record.subject.uri })
        : null;
    default:
      return null;
  }
}

function getActionMessage(
  reason: app.bsky.notification.listNotifications.Notification["reason"],
): string {
  switch (reason) {
    case "like":
      return "liked your post";
    case "like-via-repost":
      return "liked your repost";
    case "repost":
      return "reposted your post";
    case "repost-via-repost":
      return "reposted your repost";
    case "follow":
      return "followed you";
    default:
      return reason;
  }
}

function isLikeRecord(record: LexMap): record is app.bsky.feed.like.Main {
  return record.$type === "app.bsky.feed.like";
}

function isRepostRecord(record: LexMap): record is app.bsky.feed.repost.Main {
  return record.$type === "app.bsky.feed.repost";
}
