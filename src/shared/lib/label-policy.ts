import type { Did, ModerationPrefs } from "@atproto/api";

import type { app, com } from "../api/lexicons";

export interface Label<Val extends string = string> {
  /**
   * @example "!hide", "!warn", "porn", "sexual", "nudity", "graphic-media", "bot"
   */
  val: Val;
  /**
   * DID of the labeler
   */
  src: Did;
  /**
   * Whether this label applies to the profile/account (vs a post).
   */
  isProfile: boolean;
}

export interface LabelPolicy {
  hidden: boolean;
  warned: Label<LabelValWarned>[];
  mediaWarned: Label<LabelValMediaWarned>[];
  profileBadges: Label<LabelValProfileBadge>[];
}

export type LabelValWarned = "!warn";
export type LabelValMediaWarned = "porn" | "sexual" | "nudity" | "graphic-media";
export type LabelValProfileBadge = "bot";

type ContentPreferences = Pick<ModerationPrefs, "adultContentEnabled" | "labels">;

export function getPostLabelPolicy(
  post: app.bsky.feed.defs.PostView,
  preferences?: ContentPreferences,
): LabelPolicy {
  const labels = [
    ...filterEffectiveLabels(post.author.labels ?? []).map(
      ({ val, src }): Label => ({ val, src, isProfile: true }),
    ),
    ...filterEffectiveLabels(post.labels ?? []).map(
      ({ val, src }): Label => ({ val, src, isProfile: false }),
    ),
  ];
  return resolveLabelPolicy(labels, preferences);
}

export function getProfileLabelPolicy(
  profile:
    | app.bsky.actor.defs.ProfileView
    | app.bsky.actor.defs.ProfileViewBasic
    | app.bsky.actor.defs.ProfileViewDetailed,
  preferences?: ContentPreferences,
): LabelPolicy {
  const labels = filterEffectiveLabels(profile.labels ?? []).map(
    ({ val, src }): Label => ({ val, src, isProfile: true }),
  );
  return resolveLabelPolicy(labels, preferences);
}

/** Determines UI treatment for known `com.atproto.label.defs#labelValue` values only. */
function resolveLabelPolicy(labels: Label[], preferences?: ContentPreferences): LabelPolicy {
  const mediaLabels = labels.filter((label): label is Label<LabelValMediaWarned> =>
    ["porn", "sexual", "nudity", "graphic-media"].includes(label.val),
  );
  const getMediaPreference = (label: Label<LabelValMediaWarned>) => {
    if (preferences == null) {
      return "warn";
    }
    if (!preferences.adultContentEnabled) {
      return "hide";
    }
    return preferences.labels[label.val] ?? "warn";
  };

  const policy: LabelPolicy = {
    hidden:
      labels.some((label) => label.val === "!hide") ||
      mediaLabels.some((label) => getMediaPreference(label) === "hide"),
    warned: labels.filter((label): label is Label<LabelValWarned> => label.val === "!warn"),
    mediaWarned: mediaLabels.filter((label) => getMediaPreference(label) === "warn"),
    profileBadges: labels.filter(
      (label): label is Label<LabelValProfileBadge> => label.val === "bot",
    ),
  };

  return policy;
}

/** Applies `neg` labels as cancellations of a prior label with the same `src`/`val`, in event order. */
function filterEffectiveLabels(
  labels: com.atproto.label.defs.Label[],
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
