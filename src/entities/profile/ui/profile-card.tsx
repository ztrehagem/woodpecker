import type { RichTextSegment } from "@atproto/api";
import { RichText } from "@atproto/api";
import React from "react";
import { Link } from "react-router";

import type { app } from "#src/shared/api/lexicons/index.ts";
import Card from "#src/shared/ui/card.tsx";
import { PersonIcon } from "#src/shared/ui/icon/index.ts";
import Tooltip from "#src/shared/ui/tooltip.tsx";

export function ProfileCard({
  profile,
}: Readonly<{
  profile: app.bsky.actor.defs.ProfileViewDetailed;
}>): React.ReactElement {
  const hasBanner = profile.banner != null;
  const hasAvatar = profile.avatar != null;
  const hasDescription = profile.description != null && profile.description.length > 0;
  const descriptionRichText = new RichText({ text: profile.description ?? "" });
  descriptionRichText.detectFacetsWithoutResolution();

  return (
    <Card>
      <section>
        <div className="relative h-48 bg-linear-to-r from-sky-500 via-indigo-500 to-fuchsia-500 tablet:h-56">
          {hasBanner && (
            <img src={profile.banner} alt="banner" className="h-full w-full object-cover" />
          )}
          <div className="absolute inset-0 bg-linear-to-t from-slate-950/40 via-slate-950/10 to-transparent" />
        </div>

        <div className="relative px-5 pt-0 pb-6 tablet:px-8">
          <div className="-mt-14 flex flex-wrap items-end gap-4 tablet:-mt-16">
            <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-4 border-filling bg-slate-300 shadow-md tablet:h-28 tablet:w-28">
              {hasAvatar ? (
                <img src={profile.avatar} alt="avatar" className="h-full w-full object-cover" />
              ) : (
                <PersonIcon width={64} height={64} />
              )}
            </div>

            <div className="flex flex-1 flex-wrap items-start justify-between gap-3 pb-2">
              <div>
                <h2 className="text-2xl font-semibold">{profile.displayName ?? profile.handle}</h2>
                <p className="text-sm text-fg-muted">
                  <Tooltip tooltip={<span className="text-xs">{profile.did}</span>} side="right">
                    @{profile.handle}
                  </Tooltip>
                </p>
              </div>

              {/* <button
                    type="button"
                    className="cursor-pointer rounded-full border bg-backdrop px-4 py-2 text-sm font-medium"
                  >
                    Follow
                  </button> */}
            </div>
          </div>

          {hasDescription && (
            <p className="mt-5 text-sm leading-6 whitespace-pre-line">
              {Array.from(descriptionRichText.segments()).map((segment, index) => (
                <RichTextSegmentElement key={index} segment={segment} />
              ))}
            </p>
          )}

          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-fg-muted">
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

function RichTextSegmentElement({ segment }: { segment: RichTextSegment }): React.ReactElement {
  switch (true) {
    case segment.isLink():
      return (
        <a
          href={segment.text}
          target="_blank"
          className="text-fg-link hover:underline active:text-fg-link-active"
        >
          {segment.text}
        </a>
      );
    case segment.isMention():
      return (
        <Link
          to={`/profile/${segment.text.slice(1)}`}
          className="text-fg-link hover:underline active:text-fg-link-active"
        >
          {segment.text}
        </Link>
      );
    case segment.isTag():
      return <span>{segment.text}</span>;
    default:
      return <>{segment.text}</>;
  }
}
