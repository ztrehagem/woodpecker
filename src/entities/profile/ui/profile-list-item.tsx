import React from "react";
import { Link } from "react-router";

import type { app } from "#src/shared/api/lexicons/index.ts";
import { fallbackDisplayName } from "#src/shared/lib/display-name.ts";
import { getProfileLabelPolicy } from "#src/shared/lib/label-policy.ts";
import Card from "#src/shared/ui/card.tsx";
import { HiddenContentNotice, ProfileWarning } from "#src/shared/ui/content-warning/index.ts";
import { PersonIcon } from "#src/shared/ui/icon/index.ts";

import { FollowProfileButton } from "./follow-profile-button.tsx";
import { ProfileBadges } from "./profile-badges.tsx";

export function ProfileListItem({
  profile,
}: Readonly<{
  profile: app.bsky.actor.defs.ProfileView;
}>): React.ReactElement {
  const labelPolicy = getProfileLabelPolicy(profile);

  if (labelPolicy.hidden) {
    return (
      <Card>
        <div className="p-3 text-sm tablet:px-5 tablet:py-4">
          <HiddenContentNotice reason="This profile has been hidden due to a moderation label." />
        </div>
      </Card>
    );
  }

  const displayName = fallbackDisplayName(profile.displayName, profile.handle);

  const content = (
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
              <div className="grid auto-cols-auto grid-flow-col grid-cols-[auto] items-center justify-start gap-x-2">
                <span className="truncate font-bold">{displayName}</span>
                <ProfileBadges labels={labelPolicy.profileBadges} />
              </div>

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

  return labelPolicy.warned.length > 0 ? (
    <ProfileWarning labels={labelPolicy.warned} author={profile}>
      {content}
    </ProfileWarning>
  ) : (
    content
  );
}
