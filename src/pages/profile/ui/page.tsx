import type { AtIdentifierString, AtUriString } from "@atproto/lex";
import type React from "react";
import { useParams } from "react-router";

import { PostCard, TimelineUI, usePostQuery } from "#src/entities/post/index.ts";
import {
  ProfileCard,
  ProfileCardSkeleton,
  useAuthorFeedQuery,
  useProfileQuery,
} from "#src/entities/profile/index.ts";
import type { app } from "#src/shared/api/lexicons/index.ts";
import { useAssertSession } from "#src/shared/auth/index.ts";
import LoadingFallback from "#src/shared/ui/loading-fallback.tsx";
import { NakedButton } from "#src/shared/ui/naked-button.tsx";

export default function Page(): React.ReactElement {
  const { handle } = useParams();
  const actor = handle as AtIdentifierString;

  return (
    <div className="flex flex-col gap-2 py-2 tablet:gap-4 tablet:py-4">
      <ProfileBlock actor={actor} />
      <FeedBlock actor={actor} />
    </div>
  );
}

function ProfileBlock({ actor }: { actor: AtIdentifierString }): React.ReactElement {
  const session = useAssertSession();
  const { data: profile, error } = useProfileQuery(session, actor);

  if (profile) {
    return (
      <div className="flex flex-col gap-2 tablet:gap-4">
        <ProfileCard profile={profile} />
        {profile.pinnedPost && <PinnedCard uri={profile.pinnedPost.uri} />}
      </div>
    );
  } else if (error) {
    return <p className="text-fg-danger">{error.message}</p>;
  }

  return <ProfileCardSkeleton />;
}

function PinnedCard({ uri }: { uri: AtUriString }): React.ReactElement {
  const session = useAssertSession();
  const { data, error } = usePostQuery(session, uri, { depth: 0, parentHeight: 0 });

  if (data) {
    const thread = data.thread;

    if (thread.$type == "app.bsky.feed.defs#threadViewPost") {
      return <PostCard postView={(thread as app.bsky.feed.defs.ThreadViewPost).post} pinned />;
    }
    return <></>;
  } else if (error) {
    return <></>;
  }

  return <></>;
}

function FeedBlock({ actor }: { actor: AtIdentifierString }): React.ReactElement {
  const session = useAssertSession();
  const { data, error, fetchNextPage, hasNextPage, isFetchingNextPage } = useAuthorFeedQuery(
    session,
    actor,
  );

  const feed = data?.pages.flatMap((page) => page.feed);

  if (feed) {
    return (
      <div className="flex flex-col gap-4">
        {feed.length > 0 ? <TimelineUI feed={feed} /> : <p>No posts.</p>}

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
