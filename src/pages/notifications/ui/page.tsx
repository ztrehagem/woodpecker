import type React from "react";

import { useAssertSession } from "#src/shared/auth/index.ts";
import { useGlobalLoadingIndicatorEffect } from "#src/shared/ui/global-loading-indicator/index.ts";
import LoadingFallback from "#src/shared/ui/loading-fallback.tsx";
import { NakedButton } from "#src/shared/ui/naked-button.tsx";

import { useNotificationsQuery } from "../api/notifications-query.ts";
import { NotificationCard } from "./notification-card.tsx";

export function Page(): React.ReactElement {
  const session = useAssertSession();
  const { data, error, fetchNextPage, hasNextPage, isFetchingNextPage, isFetching } =
    useNotificationsQuery(session, session.did);
  useGlobalLoadingIndicatorEffect(isFetching);

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
                <NotificationCard notification={notification} />
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
