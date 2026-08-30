import { hasMutedWord, type Did, type ModerationPrefs } from "@atproto/api";

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

export interface ModerationPolicy {
  hidden: boolean;
  muted: boolean;
  warned: Label<LabelValWarned>[];
  mediaWarned: Label<LabelValMediaWarned>[];
  profileBadges: Label<LabelValProfileBadge>[];
}

export type LabelValWarned = "!warn";
export type LabelValMediaWarned = "porn" | "sexual" | "nudity" | "graphic-media";
export type LabelValProfileBadge = "bot";

type ContentPreferences = Pick<ModerationPrefs, "adultContentEnabled" | "labels"> &
  Partial<Pick<ModerationPrefs, "mutedWords">>;

export function getPostModerationPolicy(
  post: app.bsky.feed.defs.PostView,
  preferences?: ContentPreferences,
  viewerDid?: Did,
): ModerationPolicy {
  const labels = [
    ...filterEffectiveLabels(post.author.labels ?? []).map(
      ({ val, src }): Label => ({ val, src, isProfile: true }),
    ),
    ...filterEffectiveLabels(post.labels ?? []).map(
      ({ val, src }): Label => ({ val, src, isProfile: false }),
    ),
  ];
  const policy = resolveLabelModerationPolicy(labels, preferences);

  if (
    preferences != null &&
    isPostRecord(post.record) &&
    post.author.did !== viewerDid &&
    hasMutedWord({
      mutedWords: preferences.mutedWords ?? [],
      text: post.record.text,
      facets: post.record.facets,
      languages: post.record.langs,
      actor: post.author,
    })
  ) {
    policy.hidden = true;
    policy.muted = true;
  }

  return policy;
}

export function getProfileModerationPolicy(
  profile:
    | app.bsky.actor.defs.ProfileView
    | app.bsky.actor.defs.ProfileViewBasic
    | app.bsky.actor.defs.ProfileViewDetailed,
  preferences?: ContentPreferences,
): ModerationPolicy {
  const labels = filterEffectiveLabels(profile.labels ?? []).map(
    ({ val, src }): Label => ({ val, src, isProfile: true }),
  );
  return resolveLabelModerationPolicy(labels, preferences);
}

/** Determines UI treatment for known `com.atproto.label.defs#labelValue` values only. */
function resolveLabelModerationPolicy(
  labels: Label[],
  preferences?: ContentPreferences,
): ModerationPolicy {
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

  const policy: ModerationPolicy = {
    hidden:
      labels.some((label) => label.val === "!hide") ||
      mediaLabels.some((label) => getMediaPreference(label) === "hide"),
    muted: false,
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

function isPostRecord(record: object): record is app.bsky.feed.post.Main {
  return "$type" in record && record.$type === "app.bsky.feed.post";
}
