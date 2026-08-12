import type React from "react";

import { TimelineUI } from "#src/entities/timeline/index.ts";
import { useAssertSession } from "#src/shared/auth/index.ts";
import LoadingFallback from "#src/shared/ui/loading-fallback.tsx";
import { NakedButton } from "#src/shared/ui/naked-button.tsx";

import { useLikesQuery } from "../api/likes-query.ts";

export function Page(): React.ReactElement {
  const session = useAssertSession();
  const { data, error, fetchNextPage, hasNextPage, isFetchingNextPage } = useLikesQuery(
    session,
    session.did,
  );

  const feed = data?.pages.flatMap((page) => page.feed);

  let content: React.ReactNode;

  if (error) {
    content = <p className="text-fg-danger">{error.message}</p>;
  } else if (feed) {
    content = (
      <div className="flex flex-col gap-4">
        {feed.length > 0 ? <TimelineUI feed={feed} all /> : <p>No likes.</p>}

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
