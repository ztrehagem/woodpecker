import type { LabelPreference } from "@atproto/api";
import { Select, Switch } from "@base-ui/react";
import React from "react";

import Card from "#src/shared/ui/card.tsx";
import { CaretDownIcon, CheckIcon } from "#src/shared/ui/icon/index.ts";

const ADULT_CONTENT_LABELS = [
  ["porn", "Pornography"],
  ["sexual", "Sexually suggestive"],
  ["nudity", "Non-sexual nudity"],
  ["graphic-media", "Graphic media"],
] as const;

const LABEL_PREFERENCES = [
  ["hide", "Hide"],
  ["warn", "Warn"],
  ["ignore", "Show"],
] as const satisfies [LabelPreference, string][];

type AdultContentLabel = (typeof ADULT_CONTENT_LABELS)[number][0];

function getLabelPreference(
  labels: Record<string, LabelPreference>,
  label: AdultContentLabel,
): LabelPreference {
  switch (label) {
    case "porn":
      return labels.porn ?? "warn";
    case "sexual":
      return labels.sexual ?? "warn";
    case "nudity":
      return labels.nudity ?? "warn";
    case "graphic-media":
      return labels["graphic-media"] ?? "warn";
  }
}

interface ContentVisibilitySettingsProps {
  adultContentEnabled: boolean;
  labels: Record<string, LabelPreference>;
  isSaving: boolean;
  onAdultContentEnabledChange: (enabled: boolean) => void;
  onLabelPreferenceChange: (label: AdultContentLabel, preference: LabelPreference) => void;
}

export function ContentVisibilitySettings({
  adultContentEnabled,
  labels,
  isSaving,
  onAdultContentEnabledChange,
  onLabelPreferenceChange,
}: ContentVisibilitySettingsProps): React.ReactElement {
  return (
    <Card>
      <section className="p-5 tablet:p-6" aria-labelledby="content-settings-heading">
        <h2 id="content-settings-heading" className="text-lg font-semibold">
          Content visibility
        </h2>
        <div className="mt-5 flex items-center justify-between gap-6">
          <div>
            <label htmlFor="adult-content" className="font-medium">
              Show adult content
            </label>
            <p className="mt-1 text-sm text-fg-muted">
              Allow media labeled as adult content to be revealed.
            </p>
          </div>
          <Switch.Root
            id="adult-content"
            checked={adultContentEnabled}
            disabled={isSaving}
            onCheckedChange={onAdultContentEnabledChange}
            className="flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full bg-highlight p-1 transition-colors disabled:cursor-wait disabled:opacity-60 data-checked:bg-link"
          >
            <Switch.Thumb className="size-5 rounded-full bg-white transition-transform data-checked:translate-x-5" />
          </Switch.Root>
        </div>

        <div className="mt-5 divide-y divide-highlight border-t border-highlight">
          {ADULT_CONTENT_LABELS.map(([label, name]) => (
            <div key={label} className="flex items-center justify-between gap-6 py-4">
              <ContentLabelPreferenceSelect
                label={label}
                name={name}
                value={getLabelPreference(labels, label)}
                disabled={!adultContentEnabled || isSaving}
                onValueChange={onLabelPreferenceChange}
              />
            </div>
          ))}
        </div>
      </section>
    </Card>
  );
}

interface ContentLabelPreferenceSelectProps {
  label: AdultContentLabel;
  name: string;
  value: LabelPreference;
  disabled: boolean;
  onValueChange: (label: AdultContentLabel, preference: LabelPreference) => void;
}

function ContentLabelPreferenceSelect({
  label,
  name,
  value,
  disabled,
  onValueChange,
}: ContentLabelPreferenceSelectProps): React.ReactElement {
  return (
    <Select.Root
      items={LABEL_PREFERENCES.map(([value, label]) => ({ value, label }))}
      value={value}
      disabled={disabled}
      onValueChange={(preference) => preference && onValueChange(label, preference)}
    >
      <Select.Label className="text-sm font-medium">{name}</Select.Label>

      <Select.Trigger className="flex h-9 min-w-28 cursor-pointer items-center justify-between gap-3 rounded-md border border-highlight bg-filling px-3 text-sm outline-none select-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50">
        <Select.Value />
        <Select.Icon className="text-xs text-fg-muted">
          <CaretDownIcon />
        </Select.Icon>
      </Select.Trigger>

      <Select.Portal className="relative z-(--index-overlay)">
        <Select.Positioner className="z-(--index-popover) outline-none" sideOffset={4}>
          <Select.Popup className="min-w-(--anchor-width) overflow-hidden rounded-md border border-highlight bg-filling py-1 shadow-lg transition-[transform,opacity] outline-none data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0">
            <Select.List>
              {LABEL_PREFERENCES.map(([value, name]) => (
                <Select.Item
                  key={value}
                  value={value}
                  className="grid cursor-pointer grid-cols-[1rem_1fr] items-center gap-2 px-3 py-2 text-sm outline-none select-none data-highlighted:bg-highlight"
                >
                  <Select.ItemIndicator className="text-xs">
                    <CheckIcon className="size-4" aria-hidden="true" />
                  </Select.ItemIndicator>
                  <Select.ItemText className="col-start-2">{name}</Select.ItemText>
                </Select.Item>
              ))}
            </Select.List>
          </Select.Popup>
        </Select.Positioner>
      </Select.Portal>
    </Select.Root>
  );
}
