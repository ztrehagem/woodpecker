import type { AtIdentifierString } from "@atproto/lex";
import type React from "react";
import { Link, useParams } from "react-router";

import { ProfileListItem, useProfileQuery } from "#src/entities/profile/index.ts";
import { useAssertSession } from "#src/shared/auth/index.ts";
import { fallbackDisplayName } from "#src/shared/lib/display-name.ts";
import { formatCount } from "#src/shared/lib/format-count.ts";
import { useGlobalLoadingIndicatorEffect } from "#src/shared/ui/global-loading-indicator/index.ts";
import { PersonIcon } from "#src/shared/ui/icon/index.ts";
import LoadingFallback from "#src/shared/ui/loading-fallback.tsx";
import { NakedButton } from "#src/shared/ui/naked-button.tsx";

import { useFollowersQuery } from "../api/followers-query.ts";

export function Page(): React.ReactElement {
  const { handle } = useParams();
  const session = useAssertSession();
  const { data, error, fetchNextPage, hasNextPage, isFetchingNextPage, isFetching } =
    useFollowersQuery(session, handle as AtIdentifierString);
  const { data: profile, isFetching: isFetchingProfile } = useProfileQuery(
    session,
    handle as AtIdentifierString,
  );
  useGlobalLoadingIndicatorEffect(isFetching || isFetchingProfile);

  const followers = data?.pages.flatMap((page) => page.followers);
  const subject = data?.pages[0]?.subject;
  let content: React.ReactNode;

  if (error) {
    content = <p className="text-fg-danger">{error.message}</p>;
  } else if (followers) {
    content = (
      <>
        {followers.length > 0 ? (
          <div className="grid grid-cols-1 gap-2 tablet:gap-4">
            {followers.map((profile) => (
              <ProfileListItem key={profile.did} profile={profile} />
            ))}
          </div>
        ) : (
          <p>No followers.</p>
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
      </>
    );
  } else {
    content = <LoadingFallback />;
  }

  return (
    <div className="flex flex-col gap-4 py-2 tablet:py-4">
      {subject && (
        <header>
          <div className="flex items-center gap-2">
            <div className="flex size-12 shrink-0 items-center justify-center">
              <Link
                to={`/profile/${subject.handle}`}
                className="size-full overflow-hidden rounded-full bg-slate-300"
              >
                {subject?.avatar != null ? (
                  <img src={subject.avatar} alt="" className="size-full object-cover" />
                ) : (
                  <PersonIcon width={32} height={32} />
                )}
              </Link>
            </div>

            <div className="grid grid-cols-1">
              <h2 className="text-xl font-bold">
                <Link to={`/profile/${subject.handle}`} className="text-inherit hover:underline">
                  {fallbackDisplayName(subject.displayName, subject.handle)}
                </Link>
              </h2>

              {profile && (
                <p className="text-sm text-fg-muted">
                  {formatCount(profile.followersCount ?? 0)} followers
                </p>
              )}
            </div>
          </div>
        </header>
      )}
      {content}
    </div>
  );
}
