import React from "react";

import type { app } from "#src/shared/api/lexicons/index.ts";

import type { Post } from "../model/post";

export function EmbedView({ embed }: { embed: NonNullable<Post["embed"]> }): React.ReactElement {
  switch (embed.$type) {
    case "app.bsky.embed.external#view":
      return <ExternalEmbedView embed={embed as app.bsky.embed.external.View} />;
    case "app.bsky.embed.gallery#view":
      return <GalleryEmbedView embed={embed as app.bsky.embed.gallery.View} />;
    case "app.bsky.embed.images#view":
      return <ImagesEmbedView embed={embed as app.bsky.embed.images.View} />;
    case "app.bsky.embed.record#view":
      return <RecordEmbedView embed={embed as app.bsky.embed.record.View} />;
    case "app.bsky.embed.recordWithMedia#view":
      return <RecordWithMediaEmbedView embed={embed as app.bsky.embed.recordWithMedia.View} />;
    case "app.bsky.embed.video#view":
      return <VideoEmbedView embed={embed as app.bsky.embed.video.View} />;
    default:
      return (
        <div className="my-3 rounded-md border border-filling px-3 py-2 text-sm text-fg-muted">
          Unsupported embed
        </div>
      );
  }
}

function ExternalEmbedView({ embed }: { embed: app.bsky.embed.external.View }): React.ReactElement {
  const { external } = embed;
  const thumb = external.thumb;

  return (
    <div className="relative my-3 flex flex-col overflow-hidden rounded-md border border-highlight bg-highlight tablet:flex-row">
      <div className="flex flex-1 flex-col gap-1 px-3 py-2">
        <a
          href={external.uri}
          target="_blank"
          className="text-sm font-semibold wrap-anywhere after:absolute after:inset-0 after:block"
        >
          {external.title}
        </a>

        {external.description && (
          <div className="text-xs wrap-anywhere text-fg-muted">{external.description}</div>
        )}

        <div className="mt-auto text-2xs wrap-anywhere text-fg-muted">
          {new URL(external.uri).hostname}
        </div>
      </div>
      {thumb != null && (
        <img
          src={thumb}
          alt=""
          className="aspect-video shrink-0 object-cover tablet:min-h-24 tablet:w-48"
        />
      )}
    </div>
  );
}

function GalleryEmbedView({ embed }: { embed: app.bsky.embed.gallery.View }): React.ReactElement {
  const items = embed.items as Array<app.bsky.embed.gallery.ViewImage>;

  return (
    <div className="my-3 grid w-full grid-cols-1 grid-rows-1 overflow-x-auto">
      <div className="grid w-max auto-cols-fr grid-flow-col grid-rows-1 gap-1">
        {items.map((image, index) => (
          <a
            key={index}
            href={image.fullsize}
            target="_blank"
            className="overflow-hidden rounded-md border border-highlight"
          >
            <img src={image.thumbnail} alt={image.alt} className="h-60 w-60 object-cover" />
          </a>
        ))}
      </div>
    </div>
  );
}

function ImagesEmbedView({ embed }: { embed: app.bsky.embed.images.View }): React.ReactElement {
  if (embed.images.length == 1) {
    return (
      <div className="my-3 grid grid-cols-1 grid-rows-1">
        {embed.images.map((image, index) => (
          <a
            key={index}
            href={image.fullsize}
            target="_blank"
            className="mx-auto block w-max max-w-full overflow-hidden rounded-md border border-highlight"
          >
            <img src={image.thumb} alt={image.alt} className="max-h-90 w-max object-contain" />
          </a>
        ))}
      </div>
    );
  }

  return (
    <div className="my-3 grid gap-2 mobile:grid-cols-2">
      {embed.images.map((image, index) => (
        <a
          key={index}
          href={image.fullsize}
          target="_blank"
          className="overflow-hidden rounded-md border border-highlight"
        >
          <img src={image.thumb} alt={image.alt} className="h-60 w-full object-cover" />
        </a>
      ))}
    </div>
  );
}

function RecordEmbedView({ embed }: { embed: app.bsky.embed.record.View }): React.ReactElement {
  const record = embed.record as app.bsky.embed.record.ViewRecord | undefined;

  if (!record || record.$type !== "app.bsky.embed.record#viewRecord") {
    return (
      <div className="my-3 rounded-md border border-highlight px-3 py-2 text-sm text-fg-muted">
        Embedded record
      </div>
    );
  }

  return (
    <div className="my-3 rounded-md border border-highlight px-3 py-2">
      <div className="text-sm font-semibold">
        {record.author.displayName ?? record.author.handle}
      </div>
      <div className="mt-1 text-xs wrap-anywhere text-fg-muted">{record.uri}</div>
    </div>
  );
}

function RecordWithMediaEmbedView({
  embed,
}: {
  embed: app.bsky.embed.recordWithMedia.View;
}): React.ReactElement {
  return (
    <div className="my-3 rounded-md border border-filling px-3 py-2">
      <div className="text-sm font-semibold">Embedded post with media</div>
      <div className="mt-1 text-xs text-fg-muted">{embed.record.$type ?? "embedded record"}</div>
    </div>
  );
}

function VideoEmbedView({ embed }: { embed: app.bsky.embed.video.View }): React.ReactElement {
  const thumbnail = embed.thumbnail;

  return (
    <div className="my-3 overflow-hidden rounded-md border border-filling">
      {thumbnail != null && (
        <img src={thumbnail} alt={embed.alt ?? ""} className="h-40 w-full object-cover" />
      )}
      <div className="px-3 py-2 text-sm text-fg-muted">Video</div>
    </div>
  );
}
