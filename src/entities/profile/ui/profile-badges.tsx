import React from "react";

import type { Label, LabelValProfileBadge } from "#src/shared/lib/label-policy.ts";

export function ProfileBadges({
  labels,
}: {
  labels: Label<LabelValProfileBadge>[];
}): React.ReactElement {
  const bot = labels.some((label) => label.val == "bot");

  return <>{bot && <BotBadge />}</>;
}

function BotBadge(): React.ReactElement {
  return (
    <span className="rounded-full border border-highlight bg-filling px-1.5 py-0.5 text-2xs text-fg-muted">
      Bot
    </span>
  );
}
