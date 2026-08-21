import clsx from "clsx";
import { useState, useTransition, type ReactElement } from "react";

import type { app } from "#src/shared/api/lexicons/index.ts";
import { useAssertSession } from "#src/shared/auth/index.ts";
import { LoadingDotsIcon } from "#src/shared/ui/icon/index.ts";

import { followProfile, unfollowProfile } from "../api/follow-profile.ts";

export function FollowProfileButton({
  profile,
}: Readonly<{
  profile: Pick<app.bsky.actor.defs.ProfileView, "did" | "viewer">;
}>): ReactElement | null {
  const session = useAssertSession();
  const [followingUri, setFollowingUri] = useState(profile.viewer?.following ?? null);
  const [isPending, startTransition] = useTransition();

  if (profile.did === session.did) {
    return null;
  }

  const isFollowing = followingUri != null;
  let label = "Follow";
  if (isFollowing) {
    label = "Following";
  } else if (profile.viewer?.followedBy != null) {
    label = "Follow back";
  }

  const toggleFollow = (): void => {
    if (isPending) {
      return;
    }

    startTransition(async () => {
      try {
        if (followingUri != null) {
          await unfollowProfile(session, followingUri);
          setFollowingUri(null);
        } else {
          const { uri } = await followProfile(session, profile.did);
          setFollowingUri(uri);
        }
      } catch (error) {
        console.error(error);
      }
    });
  };

  return (
    <button
      type="button"
      onClick={toggleFollow}
      disabled={isPending}
      aria-label={label}
      aria-busy={isPending}
      className={clsx(
        "pointer-events-auto relative h-8 shrink-0 cursor-pointer rounded-full bg-backdrop px-4 text-sm font-medium",
        isFollowing ? "bg-highlight text-fg-muted" : "bg-link text-white",
      )}
    >
      <span className={clsx("flex items-center justify-center gap-2", isPending && "invisible")}>
        {label}
      </span>
      {isPending && (
        <LoadingDotsIcon className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      )}
    </button>
  );
}
