import { useInfiniteQuery } from "@tanstack/react-query";
import React from "react";

import { timelineQuery, TimelineView } from "#src/entities/timeline/index.ts";
import { useSession } from "#src/shared/lib/atproto/index.ts";
import Container from "#src/shared/ui/container.tsx";
import ErrorBoundary from "#src/shared/ui/error-boundary.ts";
import LoadingFallback from "#src/shared/ui/loading-fallback.tsx";

export default function SignedInView(): React.ReactElement {
  const session = useSession();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery(
    timelineQuery(session),
  );

  const feed = data?.pages.flatMap((page) => page.feed);

  return (
    <ErrorBoundary fallback={<div>Failed to load</div>}>
      <div className="py-4">
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
