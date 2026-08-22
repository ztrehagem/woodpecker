import React from "react";

import type { app } from "#src/shared/api/lexicons/index.ts";
import { fallbackDisplayName } from "#src/shared/lib/display-name.ts";
import Card from "#src/shared/ui/card.tsx";

import { NotificationPostCard } from "./notification-post-card";

export function NotificationCard({
  notification,
}: {
  notification: app.bsky.notification.listNotifications.Notification;
}): React.ReactElement {
  switch (notification.reason) {
    case "like":
      return <NotificationPlaceholderCard notification={notification} />;
    case "repost":
      return <NotificationPlaceholderCard notification={notification} />;
    case "follow":
      return <NotificationPlaceholderCard notification={notification} />;
    case "mention":
    case "reply":
    case "quote":
      return <NotificationPostCard notification={notification} />;
    default: {
      return <NotificationPlaceholderCard notification={notification} />;
    }
  }
}

function NotificationPlaceholderCard({
  notification,
}: {
  notification: app.bsky.notification.listNotifications.Notification;
}): React.ReactElement {
  const message = buildNofificationMessage(notification);

  return (
    <Card>
      <div className="p-3 tablet:px-4 tablet:py-5">
        <p>{message}</p>
        <pre className="text-2xs text-fg-muted">{JSON.stringify(notification, null, 2)}</pre>
      </div>
    </Card>
  );
}

function buildNofificationMessage(
  notification: app.bsky.notification.listNotifications.Notification,
): string {
  const actorName = fallbackDisplayName(
    notification.author.displayName,
    notification.author.handle,
  );

  switch (notification.reason) {
    case "like":
      return `${actorName} liked your post`;
    case "repost":
      return `${actorName} reposted your post`;
    case "follow":
      return `${actorName} followed you`;
    default:
      return `${actorName}: ${notification.reason}`;
  }
}
