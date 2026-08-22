import { asDatetimeString } from "@atproto/lex";
import React from "react";
import { Link } from "react-router";

import { timeAgo } from "#src/entities/post/index.ts";
import { FollowProfileButton } from "#src/entities/profile/index.ts";
import type { app } from "#src/shared/api/lexicons/index.ts";
import { fallbackDisplayName } from "#src/shared/lib/display-name.ts";
import Card from "#src/shared/ui/card.tsx";
import { FavoriteIcon, PersonAddIcon, RepeatIcon } from "#src/shared/ui/icon/index.ts";
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

  return (
    <Card>
      <article className="p-3 text-sm tablet:px-5 tablet:py-4">
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
          </div>
        </div>
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
      return <FavoriteIcon className="text-fg-like" />;
    case "repost":
      return <RepeatIcon className="text-fg-repost" />;
    case "follow":
      return <PersonAddIcon className="text-fg-link" />;
    default:
      return <></>;
  }
}

function getActionMessage(
  reason: app.bsky.notification.listNotifications.Notification["reason"],
): string {
  switch (reason) {
    case "like":
      return "liked your post";
    case "repost":
      return "reposted your post";
    case "follow":
      return "followed you";
    default:
      return reason;
  }
}
