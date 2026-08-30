import { Collapsible } from "@base-ui/react/collapsible";
import React from "react";

import type { app } from "#src/shared/api/lexicons/index.ts";
import type { Label, LabelValMediaWarned } from "#src/shared/lib/label-policy.ts";
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
      <Collapsible.Trigger className="group relative flex w-full cursor-pointer items-center gap-1 rounded-sm bg-highlight px-2 py-3 text-xs text-fg-muted">
        <CaretRightIcon className="size-6 shrink-0 transition-transform duration-100 ease-[ease-out] group-data-panel-open:rotate-90" />
        <InfoIcon className="size-4 shrink-0 text-fg-muted" />
        <span className="text-start">This media may contain {warningNouns}.</span>
        <LabelListDialog labels={labels} author={author} />
      </Collapsible.Trigger>
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
