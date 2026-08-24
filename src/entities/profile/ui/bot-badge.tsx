import React from "react";

import type { app } from "#src/shared/api/lexicons/index.ts";

type BotBadgeProps =
  | {
      profile:
        | app.bsky.actor.defs.ProfileView
        | app.bsky.actor.defs.ProfileViewBasic
        | app.bsky.actor.defs.ProfileViewDetailed;
      postView?: never;
    }
  | {
      postView: app.bsky.feed.defs.PostView;
      profile?: never;
    };

export function BotBadge(props: BotBadgeProps): React.ReactElement | null {
  const labels =
    props.postView != null
      ? [...(props.postView.author.labels ?? []), ...(props.postView.labels ?? [])]
      : props.profile.labels;
  // The last label with a given val determines its final state (negation labels cancel earlier ones)
  const botLabel = (labels ?? []).findLast((label) => label.val === "bot");
  const isBot = botLabel != null && botLabel.neg !== true;

  if (!isBot) {
    return null;
  }

  return (
    <span className="rounded-full border border-highlight bg-filling px-1.5 py-0.5 text-2xs text-fg-muted">
      Bot
    </span>
  );
}
