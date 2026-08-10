import type { AtIdentifierString, AtUriString } from "@atproto/lex";
import type React from "react";
import { useParams } from "react-router";

import { PostCard, usePostQuery, type ThreadViewPost } from "#src/entities/post/index.ts";
import { ProfileCard, ProfileCardSkeleton, useProfileQuery } from "#src/entities/profile/index.ts";
import { TimelineView } from "#src/entities/timeline/index.ts";
import { useAssertSession } from "#src/shared/auth/index.ts";
import Container from "#src/shared/ui/container.tsx";
import LoadingFallback from "#src/shared/ui/loading-fallback.tsx";
import { NakedButton } from "#src/shared/ui/naked-button.tsx";

import { useAuthorFeedQuery } from "../api/author-feed-query.ts";

export default function Page(): React.ReactElement {
  const { handle } = useParams();
  const actor = handle as AtIdentifierString;

  return (
    <div className="flex flex-col gap-4 py-4">
      <Container>
        <ProfileView actor={actor} />
      </Container>

      <Container>
        <FeedView actor={actor} />
      </Container>
    </div>
  );
}

function ProfileView({ actor }: { actor: AtIdentifierString }): React.ReactElement {
  const session = useAssertSession();
  const { data: profile, error } = useProfileQuery(session, actor);

  if (profile) {
    return (
      <div className="flex flex-col gap-4">
        <ProfileCard profile={profile} />
        {profile.pinnedPost && <PinnedView uri={profile.pinnedPost.uri} />}
      </div>
    );
  } else if (error) {
    return <p className="text-fg-danger">{error.message}</p>;
  }

  return <ProfileCardSkeleton />;
}

function PinnedView({ uri }: { uri: AtUriString }): React.ReactElement {
  const session = useAssertSession();
  const { data, error } = usePostQuery(session, uri, { depth: 0, parentHeight: 0 });

  if (data) {
    const thread = data.thread;

    if (thread.$type == "app.bsky.feed.defs#threadViewPost") {
      return <PostCard post={(thread as ThreadViewPost).post} pinned />;
    }
    return <></>;
  } else if (error) {
    return <></>;
  }

  return <></>;
}

function FeedView({ actor }: { actor: AtIdentifierString }): React.ReactElement {
  const session = useAssertSession();
  const { data, error, fetchNextPage, hasNextPage, isFetchingNextPage } = useAuthorFeedQuery(
    session,
    actor,
  );

  const feed = data?.pages.flatMap((page) => page.feed);

  if (feed) {
    return (
      <div className="flex flex-col gap-4">
        {feed.length > 0 ? <TimelineView feed={feed} /> : <p>No posts.</p>}

        {error && <p className="text-fg-danger">{error.message}</p>}

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
  } else if (error) {
    return <p className="text-fg-danger">{error.message}</p>;
  }

  return <LoadingFallback />;
}
