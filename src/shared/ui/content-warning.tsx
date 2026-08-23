import { Collapsible } from "@base-ui/react/collapsible";
import React from "react";

import { CaretRightIcon, InfoIcon } from "#src/shared/ui/icon/index.ts";

export function HiddenContentNotice({ reason }: { reason: string }): React.ReactElement {
  return (
    <div className="rounded-md border border-highlight px-3 py-2 text-sm text-fg-muted">
      {reason}
    </div>
  );
}

export function CollapsibleWarning({
  reason,
  children,
}: React.PropsWithChildren<{ reason: string }>): React.ReactElement {
  return (
    <Collapsible.Root className="my-2 flex flex-col items-start gap-2">
      <Collapsible.Trigger className="group relative flex w-full cursor-pointer items-center gap-1 rounded-sm bg-highlight px-2 py-3 text-xs text-fg-muted">
        <CaretRightIcon className="size-6 shrink-0 transition-transform duration-100 ease-[ease-out] group-data-panel-open:rotate-90" />
        <InfoIcon className="size-4 shrink-0 text-fg-muted" />
        <span className="text-start">{reason}</span>
      </Collapsible.Trigger>
      <Collapsible.Panel className="w-full">{children}</Collapsible.Panel>
    </Collapsible.Root>
  );
}
