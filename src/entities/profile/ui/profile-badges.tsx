import React from "react";

import type { Label, LabelValProfileBadge } from "#src/shared/lib/moderation-policy.ts";

import { BotBadge } from "./bot-badge";

export function ProfileBadges({
  labels,
}: {
  labels: Label<LabelValProfileBadge>[];
}): React.ReactElement {
  const bot = labels.some((label) => label.val == "bot");

  return <>{bot && <BotBadge />}</>;
}
