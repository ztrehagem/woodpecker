import React from "react";

import { TimelineUI, useTimelineQuery } from "#src/entities/post/index.ts";
import { useAssertSession } from "#src/shared/auth/index.ts";
import { useGlobalLoadingIndicatorEffect } from "#src/shared/ui/global-loading-indicator/index.ts";
import LoadingFallback from "#src/shared/ui/loading-fallback.tsx";
import { NakedButton } from "#src/shared/ui/naked-button.tsx";

export default function SignedInUI(): React.ReactElement {
  const session = useAssertSession();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isFetching } =
    useTimelineQuery(session);
  useGlobalLoadingIndicatorEffect(isFetching);

  const feed = data?.pages.flatMap((page) => page.feed);

  return (
    <div className="flex flex-col gap-2 py-2 tablet:gap-4 tablet:py-4">
      {feed ? (
        <div className="flex flex-col gap-4">
          <TimelineUI feed={feed} />
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
      ) : (
        <LoadingFallback />
      )}
    </div>
  );
}
