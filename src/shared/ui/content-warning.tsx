import { Collapsible } from "@base-ui/react/collapsible";
import { Dialog } from "@base-ui/react/dialog";
import React from "react";
import { Link } from "react-router";

import { CaretRightIcon, CloseIcon, InfoIcon } from "#src/shared/ui/icon/index.ts";

import type { app } from "../api/lexicons";
import type { Label, LabelValMediaWarned, LabelValWarned } from "../lib/label-policy";
import Card from "./card";

export function HiddenContentNotice({ reason }: { reason: string }): React.ReactElement {
  return (
    <div className="rounded-md border border-highlight px-3 py-2 text-sm text-fg-muted">
      {reason}
    </div>
  );
}

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
        <span className="text-start">This content is warned.</span>
        <LabelListDialog labels={labels} author={author} />
      </Collapsible.Trigger>
      <Collapsible.Panel className="w-full">{children}</Collapsible.Panel>
    </Collapsible.Root>
  );
}

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

function LabelListDialog({
  labels,
  author,
}: {
  labels: Label[];
  author: ProfileView;
}): React.ReactElement {
  return (
    <Dialog.Root>
      <Dialog.Trigger
        aria-label="View labels"
        onClick={stopPropagation}
        className="-my-2 ml-auto flex shrink-0 cursor-pointer items-center p-2 hover:underline"
        render={(props) => <span {...props} />}
      >
        Labels
      </Dialog.Trigger>
      <Dialog.Portal className="relative z-(--index-overlay)">
        <Dialog.Backdrop className="fixed inset-0 bg-backdrop/75" />
        <Dialog.Viewport className="fixed inset-0 flex items-center justify-center p-6">
          <Dialog.Popup className="max-w-column-main">
            <Card>
              <div className="flex flex-col gap-4 px-5 py-4">
                <div className="flex justify-between">
                  <Dialog.Title className="text-base font-bold">Labels</Dialog.Title>
                  <Dialog.Close className="cursor-pointer text-fg-muted">
                    <CloseIcon />
                  </Dialog.Close>
                </div>
                <LabelList labels={labels} author={author} />
              </div>
            </Card>
          </Dialog.Popup>
        </Dialog.Viewport>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

// Prevents opening the dialog from also toggling the surrounding Collapsible.Trigger.
function stopPropagation(e: React.MouseEvent): void {
  e.stopPropagation();
}

function LabelList({
  labels,
  author,
}: {
  labels: Label[];
  author: ProfileView;
}): React.ReactElement {
  return (
    <ul className="flex flex-col items-start gap-1">
      {labels.map((label) => (
        <LabelItem key={label.val} label={label} author={author} />
      ))}
    </ul>
  );
}

function LabelItem({ label, author }: { label: Label; author: ProfileView }): React.ReactElement {
  return (
    <li className="rounded-sm bg-highlight px-2 py-1 text-sm text-fg-muted">
      {label.val} {label.isProfile && "(Account) "}
      {label.src == author.did ? (
        "(self-labelled)"
      ) : (
        <>
          (labelled by <Link to={`/profile/${label.src}`}>{label.src}</Link>)
        </>
      )}
    </li>
  );
}

const MEDIA_LABEL_NOUNS = [
  ["porn", "pornography"],
  ["sexual", "sexual content"],
  ["nudity", "nudity"],
  ["graphic-media", "graphic media"],
] as const satisfies [LabelValMediaWarned, string][];
