import type { com } from "#src/shared/api/lexicons/index.ts";

type Label = com.atproto.label.defs.Label;

export type LabelPolicy = {
  hidden: boolean;
  warned: boolean;
  mediaWarningReason: string | null;
};

const MEDIA_LABEL_NOUNS = new Map([
  ["porn", "pornography"],
  ["sexual", "sexual content"],
  ["nudity", "nudity"],
  ["graphic-media", "graphic media"],
]);

/** Determines UI treatment for known `com.atproto.label.defs#labelValue` values only. */
export function getLabelPolicy(labels: Label[] | undefined, authorDid?: string): LabelPolicy {
  const activeLabels = (labels ?? []).filter((label) => label.neg !== true);
  const values = activeLabels.map((label) => label.val);

  const mediaPhrases = Array.from(MEDIA_LABEL_NOUNS)
    .filter(([value]) => values.includes(value))
    .map(([value, noun]) => {
      const source =
        activeLabels.find((label) => label.val === value)?.src === authorDid
          ? "self-labeled"
          : "labeled by a moderation service";
      return `${noun} (${source})`;
    });

  return {
    hidden: values.includes("!hide"),
    warned: values.includes("!warn"),
    mediaWarningReason:
      mediaPhrases.length > 0 ? `This media may contain ${mediaPhrases.join(", ")}.` : null,
  };
}
