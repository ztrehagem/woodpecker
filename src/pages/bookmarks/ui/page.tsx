import type React from "react";

import { PostCard } from "#src/entities/post/index.ts";
import type { app } from "#src/shared/api/lexicons/index.ts";
import { useAssertSession } from "#src/shared/auth/index.ts";
import { useGlobalLoadingIndicatorEffect } from "#src/shared/ui/global-loading-indicator/index.ts";
import LoadingFallback from "#src/shared/ui/loading-fallback.tsx";
import { NakedButton } from "#src/shared/ui/naked-button.tsx";

import { useBookmarksQuery } from "../api/bookmarks-query.ts";

export function Page(): React.ReactElement {
  const session = useAssertSession();
  const { data, error, fetchNextPage, hasNextPage, isFetchingNextPage, isFetching } =
    useBookmarksQuery(session);
  useGlobalLoadingIndicatorEffect(isFetching);

  const posts = data?.pages.flatMap((page) =>
    page.bookmarks.flatMap((bookmark) =>
      bookmark.item.$type === "app.bsky.feed.defs#postView"
        ? (bookmark.item as app.bsky.feed.defs.PostView)
        : [],
    ),
  );

  let content: React.ReactNode;

  if (error) {
    content = <p className="text-fg-danger">{error.message}</p>;
  } else if (posts) {
    content = (
      <div className="flex flex-col gap-4">
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 gap-2 tablet:gap-4">
            {posts.map((post) => (
              <PostCard key={post.uri} postView={post} />
            ))}
          </div>
        ) : (
          <p>No bookmarks.</p>
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
