import type React from "react";

import { useAssertSession } from "#src/shared/auth/index.ts";
import { fallbackDisplayName } from "#src/shared/lib/display-name.ts";
import Card from "#src/shared/ui/card.tsx";
import LoadingFallback from "#src/shared/ui/loading-fallback.tsx";
import { NakedButton } from "#src/shared/ui/naked-button.tsx";

import { useNotificationsQuery } from "../api/notifications-query.ts";

export function Page(): React.ReactElement {
  const session = useAssertSession();
  const { data, error, fetchNextPage, hasNextPage, isFetchingNextPage } = useNotificationsQuery(
    session,
    session.did,
  );

  const notifications = data?.pages.flatMap((page) => page.notifications);

  let content: React.ReactNode;

  if (error) {
    content = <p className="text-fg-danger">{error.message}</p>;
  } else if (notifications) {
    content = (
      <div className="flex flex-col gap-4">
        {notifications.length > 0 ? (
          <ul className="flex flex-col gap-2 tablet:gap-4">
            {notifications.map((notification) => (
              <li key={notification.uri}>
                <Card>
                  <p className="p-3 tablet:px-4 tablet:py-5">
                    {formatNotificationMessage(notification)}
                  </p>
                </Card>
              </li>
            ))}
          </ul>
        ) : (
          <p>No notifications.</p>
        )}

        {hasNextPage && (
          <div className="self-center">
            <NakedButton
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              processing={isFetchingNextPage}
              emphasize
            >
              Load more
            </NakedButton>
          </div>
        )}
      </div>
    );
  } else {
    content = <LoadingFallback />;
  }

  return <div className="flex flex-col gap-2 py-2 tablet:gap-4 tablet:py-4">{content}</div>;
}

function formatNotificationMessage(notification: {
  reason: string;
  author: { displayName?: string | null; handle: string };
  record?: { text?: string };
}): string {
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
    case "mention":
      return `${actorName} mentioned you`;
    case "reply":
      return `${actorName} replied to you`;
    case "quote":
      return `${actorName} quoted your post`;
    default: {
      const text = notification.record?.text;
      if (text != null && text.length > 0) {
        return `${actorName}: ${text}`;
      }
      return actorName;
    }
  }
}
