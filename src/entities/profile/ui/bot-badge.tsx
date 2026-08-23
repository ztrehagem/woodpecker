import React from "react";

import type { com } from "#src/shared/api/lexicons/index.ts";

export function BotBadge({
  labels,
}: {
  labels: com.atproto.label.defs.Label[] | undefined;
}): React.ReactElement | null {
  const isBot = (labels ?? []).some((label) => label.neg !== true && label.val === "bot");

  if (!isBot) {
    return null;
  }

  return (
    <span className="rounded-full border border-highlight bg-filling px-1.5 py-0.5 text-2xs text-fg-muted">
      Bot
    </span>
  );
}
