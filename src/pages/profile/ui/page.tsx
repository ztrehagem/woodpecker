import type { AtIdentifierString } from "@atproto/lex";
import type React from "react";
import { useParams } from "react-router";

import { ProfileCard, useProfileQuery } from "#src/entities/profile/index.ts";
import { TimelineView } from "#src/entities/timeline/index.ts";
import { useAssertSession } from "#src/shared/auth/index.ts";
import Container from "#src/shared/ui/container.tsx";
import LoadingFallback from "#src/shared/ui/loading-fallback.tsx";
import { NakedButton } from "#src/shared/ui/naked-button.tsx";

import { useAuthorFeedQuery } from "../api/author-feed-query.ts";

export default function Page(): React.ReactElement {
  const session = useAssertSession();
  const { handle } = useParams();
  const actor = handle as AtIdentifierString;
  const { data: profile, error: profileError } = useProfileQuery(session, actor);
  const {
    data,
    error: authorFeedError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useAuthorFeedQuery(session, actor);

  const feed = data?.pages.flatMap((page) => page.feed);

  let profileContent: React.ReactNode = <LoadingFallback />;
  if (profileError) {
    profileContent = <p className="text-danger">{profileError.message}</p>;
  } else if (profile) {
    profileContent = <ProfileCard profile={profile} />;
  }

  let authorFeedContent: React.ReactNode = <LoadingFallback />;
  if (feed) {
    authorFeedContent = (
      <div className="flex flex-col gap-4">
        {feed.length > 0 ? <TimelineView feed={feed} /> : <p>No posts.</p>}

        {authorFeedError && <p className="text-danger">{authorFeedError.message}</p>}

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
  } else if (authorFeedError) {
    authorFeedContent = <p className="text-danger">{authorFeedError.message}</p>;
  }

  return (
    <div className="flex flex-col gap-4 py-4">
      <Container>{profileContent}</Container>

      <Container>{authorFeedContent}</Container>
    </div>
  );
}
