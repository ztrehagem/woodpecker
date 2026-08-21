import React from "react";
import { Link } from "react-router";

import type { app } from "#src/shared/api/lexicons/index.ts";
import { fallbackDisplayName } from "#src/shared/lib/display-name.ts";
import Card from "#src/shared/ui/card.tsx";
import { PersonIcon } from "#src/shared/ui/icon/index.ts";

import { FollowProfileButton } from "./follow-profile-button.tsx";

export function ProfileListItem({
  profile,
}: Readonly<{
  profile: app.bsky.actor.defs.ProfileView;
}>): React.ReactElement {
  const displayName = fallbackDisplayName(profile.displayName, profile.handle);

  return (
    <Card>
      <div className="relative p-3 text-sm has-[[data-view-profile-link]:focus-visible]:bg-highlight tablet:px-5 tablet:py-4">
        <Link
          to={`/profile/${profile.handle}`}
          aria-label={`View profile: ${displayName}`}
          data-view-profile-link
          className="absolute inset-0 block"
        ></Link>

        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2">
            <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-300">
              {profile.avatar != null ? (
                <img src={profile.avatar} alt="" className="size-full object-cover" />
              ) : (
                <PersonIcon width={32} height={32} />
              )}
            </div>

            <div className="grid grid-cols-1">
              <div className="truncate font-bold">{displayName}</div>

              <div className="truncate text-sm text-fg-muted">@{profile.handle}</div>
            </div>
          </div>

          <FollowProfileButton profile={profile} />
        </div>

        {profile.description != null && profile.description.length > 0 && (
          <p className="mt-2 line-clamp-3 text-sm whitespace-pre-line">{profile.description}</p>
        )}
      </div>
    </Card>
  );
}
