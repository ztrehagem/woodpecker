import React from "react";

import { TimelineView, useTimelineQuery } from "#src/entities/timeline/index.ts";
import { useAssertSession } from "#src/shared/auth/index.ts";
import Container from "#src/shared/ui/container.tsx";
import ErrorBoundary from "#src/shared/ui/error-boundary.ts";
import LoadingFallback from "#src/shared/ui/loading-fallback.tsx";
import { NakedButton } from "#src/shared/ui/naked-button.tsx";

import { NewPostArea } from "./new-post-area";

export default function SignedInView(): React.ReactElement {
  const session = useAssertSession();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useTimelineQuery(session);

  const feed = data?.pages.flatMap((page) => page.feed);

  return (
    <ErrorBoundary fallback={<div>Failed to load</div>}>
      <div className="flex flex-col gap-4 py-4">
        <Container>
          <NewPostArea />
        </Container>

        <Container>
          {feed ? (
            <div className="flex flex-col gap-4">
              <TimelineView feed={feed} />
              {hasNextPage && (
                <div className="self-center">
                  <NakedButton
                    onClick={() => fetchNextPage()}
                    disabled={isFetchingNextPage}
                    processing={isFetchingNextPage}
                    emphasize
                  >
                    もっと見る
                  </NakedButton>
                </div>
              )}
            </div>
          ) : (
            <LoadingFallback />
          )}
        </Container>
      </div>
    </ErrorBoundary>
  );
}
