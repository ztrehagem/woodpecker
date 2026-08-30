import { Collapsible } from "@base-ui/react/collapsible";
import React from "react";

import type { app } from "#src/shared/api/lexicons/index.ts";
import type { Label, LabelValMediaWarned } from "#src/shared/lib/moderation-policy.ts";
import { CaretRightIcon, InfoIcon } from "#src/shared/ui/icon/index.ts";

import { LabelListDialog } from "./label-list-dialog";

export { HiddenContentNotice } from "./hidden-content-notice";
export { ContentWarning } from "./content-warning";

type ProfileView =
  | app.bsky.actor.defs.ProfileView
  | app.bsky.actor.defs.ProfileViewBasic
  | app.bsky.actor.defs.ProfileViewDetailed;

export function MediaWarning({
  labels,
  author,
  children,
}: React.PropsWithChildren<{
  labels: Label<LabelValMediaWarned>[];
  author: ProfileView;
}>): React.ReactElement {
  const uniqueLabels = Array.from(new Map(labels.map((label) => [label.val, label])).values());

  const warningNouns = MEDIA_LABEL_NOUNS.filter(([label]) =>
    uniqueLabels.some((l) => l.val === label),
  )
    .map(([, noun]) => noun)
    .join(", ");

  return (
    <Collapsible.Root className="flex flex-col gap-2">
      <div className="relative flex w-full items-center gap-1 rounded-sm bg-highlight px-2 py-3 text-xs text-fg-muted">
        <Collapsible.Trigger className="group flex grow items-center gap-1 after:absolute after:inset-0 after:block after:cursor-pointer">
          <CaretRightIcon className="size-6 shrink-0 transition-transform duration-100 ease-[ease-out] group-data-panel-open:rotate-90" />
          <InfoIcon className="size-4 shrink-0 text-fg-muted" />
          <span className="grow text-start">This media may contain {warningNouns}.</span>
        </Collapsible.Trigger>

        <LabelListDialog labels={labels} author={author} />
      </div>

      <Collapsible.Panel className="w-full">{children}</Collapsible.Panel>
    </Collapsible.Root>
  );
}

const MEDIA_LABEL_NOUNS = [
  ["porn", "pornography"],
  ["sexual", "sexual content"],
  ["nudity", "nudity"],
  ["graphic-media", "graphic media"],
] as const satisfies [LabelValMediaWarned, string][];
