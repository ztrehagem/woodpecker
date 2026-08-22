import React from "react";

import type { app } from "#src/shared/api/lexicons/index.ts";
import { fallbackDisplayName } from "#src/shared/lib/display-name.ts";
import Card from "#src/shared/ui/card.tsx";

import { NotificationActionCard } from "./notification-action-card";
import { NotificationPostCard } from "./notification-post-card";

export function NotificationCard({
  notification,
}: {
  notification: app.bsky.notification.listNotifications.Notification;
}): React.ReactElement {
  switch (notification.reason) {
    case "like":
    case "like-via-repost":
    case "repost":
    case "repost-via-repost":
    case "follow":
      return <NotificationActionCard notification={notification} />;

    case "mention":
    case "reply":
    case "quote":
      return <NotificationPostCard notification={notification} />;

    case "contact-match":
    case "starterpack-joined":
    case "subscribed-post":
    case "unverified":
    case "verified":
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
  const actorName = fallbackDisplayName(
    notification.author.displayName,
    notification.author.handle,
  );

  return (
    <Card>
      <div className="p-3 tablet:px-4 tablet:py-5">
        <p>{`${actorName}: ${notification.reason}`}</p>
        {import.meta.env.DEV && (
          <pre className="text-2xs text-fg-muted">{JSON.stringify(notification, null, 2)}</pre>
        )}
      </div>
    </Card>
  );
}
