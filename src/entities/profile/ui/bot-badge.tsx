import type React from "react";

export function BotBadge(): React.ReactElement {
  return (
    <span className="rounded-full border border-highlight bg-filling px-1.5 py-0.5 text-2xs text-fg-muted">
      Bot
    </span>
  );
}
