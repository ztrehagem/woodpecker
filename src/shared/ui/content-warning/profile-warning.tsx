import React, { useState } from "react";

import type { app } from "#src/shared/api/lexicons/index.ts";
import type {
  Label,
  LabelValMediaWarned,
  LabelValWarned,
} from "#src/shared/lib/moderation-policy.ts";
import Card from "#src/shared/ui/card.tsx";
import { InfoIcon } from "#src/shared/ui/icon/index.ts";
import { NakedButton } from "#src/shared/ui/naked-button.tsx";

import { LabelListDialog } from "./label-list-dialog";

type ProfileView =
  | app.bsky.actor.defs.ProfileView
  | app.bsky.actor.defs.ProfileViewBasic
  | app.bsky.actor.defs.ProfileViewDetailed;

export function ProfileWarning({
  labels,
  author,
  children,
}: React.PropsWithChildren<{
  labels: Label<LabelValWarned | LabelValMediaWarned>[];
  author: ProfileView;
}>): React.ReactElement {
  const [isOpen, setIsOpen] = useState(false);

  if (isOpen) {
    return <>{children}</>;
  }

  return (
    <Card>
      <div className="flex flex-wrap items-center gap-2 px-5 py-4 text-sm text-fg-muted">
        <InfoIcon className="size-5 shrink-0" />

        <span className="min-w-48 grow">This account has a content warning.</span>

        <LabelListDialog labels={labels} author={author} />

        <div className="shrink-0">
          <NakedButton onClick={() => setIsOpen(true)} emphasize>
            Show
          </NakedButton>
        </div>
      </div>
    </Card>
  );
}
