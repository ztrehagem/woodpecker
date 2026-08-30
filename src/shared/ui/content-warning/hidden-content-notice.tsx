import React from "react";

export function HiddenContentNotice({ reason }: { reason: string }): React.ReactElement {
  return (
    <div className="rounded-md border border-highlight px-3 py-2 text-sm text-fg-muted">
      {reason}
    </div>
  );
}
