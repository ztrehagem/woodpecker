import React, { use } from "react";

import type { app } from "#src/shared/api/lexicons/index.ts";
import Card from "#src/shared/ui/card.tsx";
import { PersonIcon } from "#src/shared/ui/icon/index.ts";
import Tooltip from "#src/shared/ui/tooltip.tsx";

export default function ProfileCard({
  profile,
}: Readonly<{
  profile: app.bsky.actor.defs.ProfileViewDetailed;
}>): React.ReactElement {
  const hasBanner = profile.banner != null;
  const hasAvatar = profile.avatar != null;
  const hasDescription = profile.description != null && profile.description.length > 0;

  return (
    <Card>
      <section>
        <div className="relative h-48 bg-linear-to-r from-sky-500 via-indigo-500 to-fuchsia-500 sm:h-56">
          {hasBanner && (
            <img src={profile.banner} alt="banner" className="h-full w-full object-cover" />
          )}
          <div className="absolute inset-0 bg-linear-to-t from-slate-950/40 via-slate-950/10 to-transparent" />
        </div>

        <div className="relative px-5 pt-0 pb-6 sm:px-8">
          <div className="-mt-14 flex flex-wrap items-end gap-4 sm:-mt-16">
            <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-4 border-neutral-800 bg-slate-300 shadow-md sm:h-28 sm:w-28">
              {hasAvatar ? (
                <img src={profile.avatar} alt="avatar" className="h-full w-full object-cover" />
              ) : (
                <PersonIcon width={64} height={64} />
              )}
            </div>

            <div className="flex flex-1 flex-wrap items-start justify-between gap-3 pb-2">
              <div>
                <h2 className="text-2xl font-semibold">{profile.displayName ?? profile.handle}</h2>
                <p className="text-sm text-neutral-400">
                  <Tooltip tooltip={<span className="text-xs">{profile.did}</span>} side="right">
                    @{profile.handle}
                  </Tooltip>
                </p>
              </div>

              {/* <button
                    type="button"
                    className="cursor-pointer rounded-full border bg-neutral-800 px-4 py-2 text-sm font-medium"
                  >
                    Follow
                  </button> */}
            </div>
          </div>

          {hasDescription ? (
            <p className="mt-5 text-sm leading-6 whitespace-pre-line">{profile.description}</p>
          ) : null}

          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-neutral-400">
            <div>
              <span className="mr-1 font-semibold text-white">{profile.postsCount ?? 0}</span>
              Posts
            </div>
            <div>
              <span className="mr-1 font-semibold text-white">{profile.followsCount ?? 0}</span>
              Following
            </div>
            <div>
              <span className="mr-1 font-semibold text-white">{profile.followersCount ?? 0}</span>
              Followers
            </div>
          </div>
        </div>
      </section>
    </Card>
  );
}

ProfileCard.Promise = function ({
  profile: profilePromise,
}: Readonly<{
  profile: Promise<app.bsky.actor.defs.ProfileViewDetailed>;
}>): React.ReactElement {
  const profile = use(profilePromise);

  return <ProfileCard profile={profile} />;
};
