import type React from "react";

import { PostCard } from "#src/entities/post/index.ts";
import { useAssertSession } from "#src/shared/auth/index.ts";
import { useGlobalLoadingIndicatorEffect } from "#src/shared/ui/global-loading-indicator/index.ts";
import LoadingFallback from "#src/shared/ui/loading-fallback.tsx";
import { NakedButton } from "#src/shared/ui/naked-button.tsx";

import { useLikesQuery } from "../api/likes-query.ts";

export function Page(): React.ReactElement {
  const session = useAssertSession();
  const { data, error, fetchNextPage, hasNextPage, isFetchingNextPage, isFetching } = useLikesQuery(
    session,
    session.did,
  );
  useGlobalLoadingIndicatorEffect(isFetching);

  const feed = data?.pages.flatMap((page) => page.feed);

  let content: React.ReactNode;

  if (error) {
    content = <p className="text-fg-danger">{error.message}</p>;
  } else if (feed) {
    content = (
      <div className="flex flex-col gap-4">
        {feed.length > 0 ? (
          <div className="grid grid-cols-1 gap-2 tablet:gap-4">
            {feed.map((post) => (
              <PostCard key={post.post.uri} postView={post.post} />
            ))}
          </div>
        ) : (
          <p>No likes.</p>
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
