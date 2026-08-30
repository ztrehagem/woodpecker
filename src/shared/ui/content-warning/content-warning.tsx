import { Collapsible } from "@base-ui/react/collapsible";
import React from "react";

import type { app } from "#src/shared/api/lexicons/index.ts";
import type { Label, LabelValWarned } from "#src/shared/lib/label-policy.ts";
import { CaretRightIcon, InfoIcon } from "#src/shared/ui/icon/index.ts";

import { LabelListDialog } from "./label-list-dialog";

export { HiddenContentNotice } from "./hidden-content-notice";

type ProfileView =
  | app.bsky.actor.defs.ProfileView
  | app.bsky.actor.defs.ProfileViewBasic
  | app.bsky.actor.defs.ProfileViewDetailed;

export function ContentWarning({
  labels,
  author,
  children,
}: React.PropsWithChildren<{
  labels: Label<LabelValWarned>[];
  author: ProfileView;
}>): React.ReactElement {
  return (
    <Collapsible.Root className="flex flex-col gap-2">
      <Collapsible.Trigger className="group relative flex w-full cursor-pointer items-center gap-1 rounded-sm bg-highlight px-2 py-3 text-xs text-fg-muted">
        <CaretRightIcon className="size-6 shrink-0 transition-transform duration-100 ease-[ease-out] group-data-panel-open:rotate-90" />
        <InfoIcon className="size-4 shrink-0 text-fg-muted" />
        <span className="grow text-start">This content is warned.</span>
        <LabelListDialog labels={labels} author={author} />
      </Collapsible.Trigger>
      <Collapsible.Panel className="w-full">{children}</Collapsible.Panel>
    </Collapsible.Root>
  );
}
