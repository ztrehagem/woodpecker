import { Dialog } from "@base-ui/react/dialog";
import React from "react";
import { Link } from "react-router";

import type { app } from "#src/shared/api/lexicons/index.ts";
import type { Label } from "#src/shared/lib/moderation-policy.ts";
import { CloseIcon } from "#src/shared/ui/icon/index.ts";

import Card from "../card";
import { NakedButton } from "../naked-button";

type ProfileView =
  | app.bsky.actor.defs.ProfileView
  | app.bsky.actor.defs.ProfileViewBasic
  | app.bsky.actor.defs.ProfileViewDetailed;

export function LabelListDialog({
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
        render={(props) => <NakedButton severity="plain" {...props} />}
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
        <LabelItem
          key={`${label.src}:${label.val}:${label.isProfile ? "profile" : "content"}`}
          label={label}
          author={author}
        />
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
