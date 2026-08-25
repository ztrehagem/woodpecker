import type { app, com } from "../api/lexicons";

export type LabelPolicy =
  | {
      policy: "hidden" | "none";
    }
  | {
      policy: "warned" | "media-warned";
      reasonText: string;
    };

const MEDIA_LABEL_NOUNS = new Map([
  ["porn", "pornography"],
  ["sexual", "sexual content"],
  ["nudity", "nudity"],
  ["graphic-media", "graphic media"],
]);

/** Applies `neg` labels as cancellations of a prior label with the same `src`/`val`, in event order. */
function resolveEffectiveLabels(
  labels: com.atproto.label.defs.Label[] | undefined,
): com.atproto.label.defs.Label[] {
  const bySrcAndVal = new Map<string, com.atproto.label.defs.Label>();

  for (const label of labels ?? []) {
    const key = `${label.src}:${label.val}`;
    if (label.neg === true) {
      bySrcAndVal.delete(key);
    } else {
      bySrcAndVal.set(key, label);
    }
  }

  return Array.from(bySrcAndVal.values());
}

/** Determines UI treatment for known `com.atproto.label.defs#labelValue` values only. */
function resolveLabelPolicy(
  labels: com.atproto.label.defs.Label[] | undefined,
  authorDid?: string,
): LabelPolicy {
  const activeLabels = resolveEffectiveLabels(labels);
  const values = activeLabels.map((label) => label.val);

  if (values.includes("!hide")) {
    return { policy: "hidden" };
  }

  const mediaPhrases = Array.from(MEDIA_LABEL_NOUNS)
    .filter(([value]) => values.includes(value))
    .map(([value, noun]) => {
      const source =
        activeLabels.find((label) => label.val === value)?.src === authorDid
          ? "self-labeled"
          : "labeled by a moderation service";
      return `${noun} (${source})`;
    });

  if (mediaPhrases.length > 0) {
    return {
      policy: "media-warned",
      reasonText: `This media may contain ${mediaPhrases.join(", ")}.`,
    };
  }

  if (values.includes("!warn")) {
    return { policy: "warned", reasonText: "This content has a content warning." };
  }

  return { policy: "none" };
}

export function getPostLabelPolicy(post: app.bsky.feed.defs.PostView): LabelPolicy {
  const labels = [...(post.author.labels ?? []), ...(post.labels ?? [])];
  return resolveLabelPolicy(labels, post.author.did);
}

export function getProfileLabelPolicy(
  profile:
    | app.bsky.actor.defs.ProfileView
    | app.bsky.actor.defs.ProfileViewBasic
    | app.bsky.actor.defs.ProfileViewDetailed,
): LabelPolicy {
  return resolveLabelPolicy(profile.labels, profile.did);
}
