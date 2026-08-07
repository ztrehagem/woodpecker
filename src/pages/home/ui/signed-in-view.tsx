import React from "react";

import { TimelineView, useTimelineQuery } from "#src/entities/timeline/index.ts";
import { useAssertSession } from "#src/shared/auth/index.ts";
import Container from "#src/shared/ui/container.tsx";
import ErrorBoundary from "#src/shared/ui/error-boundary.ts";
import LoadingFallback from "#src/shared/ui/loading-fallback.tsx";

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
                <button
                  type="button"
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                  className="cursor-pointer self-center font-bold text-link active:text-link-active disabled:text-fg-muted"
                >
                  {isFetchingNextPage ? "読み込み中…" : "もっと見る"}
                </button>
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
