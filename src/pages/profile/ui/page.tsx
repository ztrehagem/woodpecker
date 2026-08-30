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
import { getProfileLabelPolicy } from "#src/shared/lib/label-policy.ts";
import Card from "#src/shared/ui/card.tsx";
import { HiddenContentNotice, ProfileWarning } from "#src/shared/ui/content-warning/index.ts";
import { useGlobalLoadingIndicatorEffect } from "#src/shared/ui/global-loading-indicator/index.ts";
import LoadingFallback from "#src/shared/ui/loading-fallback.tsx";
import { NakedButton } from "#src/shared/ui/naked-button.tsx";

export function Page(): React.ReactElement {
  const { handle } = useParams();
  const actor = handle as AtIdentifierString;

  return (
    <div className="flex flex-col gap-2 py-2 tablet:gap-4 tablet:py-4">
      <ProfileBlock actor={actor} />
    </div>
  );
}

function ProfileBlock({ actor }: { actor: AtIdentifierString }): React.ReactElement {
  const session = useAssertSession();
  const { data: profile, error, isFetching } = useProfileQuery(session, actor);
  useGlobalLoadingIndicatorEffect(isFetching);

  if (profile) {
    const labelPolicy = getProfileLabelPolicy(profile);

    if (labelPolicy.hidden) {
      return (
        <Card>
          <div className="p-3 tablet:px-5 tablet:py-4">
            <HiddenContentNotice reason="This account has been hidden due to a moderation label." />
          </div>
        </Card>
      );
    }

    const content = (
      <div className="flex flex-col gap-2 tablet:gap-4">
        <ProfileCard profile={profile} />
        {profile.pinnedPost && <PinnedCard uri={profile.pinnedPost.uri} />}
        <FeedBlock actor={actor} />
      </div>
    );

    return labelPolicy.warned.length > 0 ? (
      <ProfileWarning labels={labelPolicy.warned} author={profile}>
        {content}
      </ProfileWarning>
    ) : (
      content
    );
  } else if (error) {
    return <p className="text-fg-danger">{error.message}</p>;
  }

  return <ProfileCardSkeleton />;
}

function PinnedCard({ uri }: { uri: AtUriString }): React.ReactElement {
  const session = useAssertSession();
  const { data, error, isFetching } = usePostQuery(session, uri, { depth: 0, parentHeight: 0 });
  useGlobalLoadingIndicatorEffect(isFetching);

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
  const { data, error, fetchNextPage, hasNextPage, isFetchingNextPage, isFetching } =
    useAuthorFeedQuery(session, actor);
  useGlobalLoadingIndicatorEffect(isFetching);

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
