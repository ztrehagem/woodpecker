import React from "react";

import { TimelineView, useTimelineQuery } from "#src/entities/timeline/index.ts";
import { useAssertSession } from "#src/shared/auth/index.ts";
import Container from "#src/shared/ui/container.tsx";
import LoadingFallback from "#src/shared/ui/loading-fallback.tsx";
import { NakedButton } from "#src/shared/ui/naked-button.tsx";

import { NewPostArea } from "./new-post-area";
import { NewPostFab } from "./new-post-fab";

export default function SignedInView(): React.ReactElement {
  const session = useAssertSession();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useTimelineQuery(session);

  const feed = data?.pages.flatMap((page) => page.feed);

  return (
    <div className="flex flex-col gap-4 py-4">
      <Container>
        <NewPostArea />
      </Container>

      {navigator.maxTouchPoints > 0 && <NewPostFab />}

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
                  Load more
                </NakedButton>
              </div>
            )}
          </div>
        ) : (
          <LoadingFallback />
        )}
      </Container>
    </div>
  );
}
