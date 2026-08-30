import type { LabelPreference } from "@atproto/api";
import { Switch, Toast } from "@base-ui/react";
import { useQueryClient } from "@tanstack/react-query";
import React, { useOptimistic, useTransition } from "react";

import { preferencesQueryKey, usePreferencesQuery } from "#src/shared/api/index.ts";
import { useAssertSession } from "#src/shared/auth/index.ts";
import Card from "#src/shared/ui/card.tsx";
import { useGlobalLoadingIndicatorEffect } from "#src/shared/ui/global-loading-indicator/index.ts";
import LoadingFallback from "#src/shared/ui/loading-fallback.tsx";

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

export function Page(): React.ReactElement {
  const session = useAssertSession();
  const queryClient = useQueryClient();
  const toastManager = Toast.useToastManager();
  const { data: preferences, error, isFetching } = usePreferencesQuery(session);
  const adultContentEnabled = preferences?.moderationPrefs.adultContentEnabled ?? false;
  const [optimisticEnabled, setOptimisticEnabled] = useOptimistic(adultContentEnabled);
  const [isSaving, startSavingTransition] = useTransition();
  useGlobalLoadingIndicatorEffect(isFetching);

  const updateAdultContentEnabled = (enabled: boolean): void => {
    startSavingTransition(async () => {
      setOptimisticEnabled(enabled);

      try {
        await session.agent.setAdultContentEnabled(enabled);
        await queryClient.invalidateQueries({ queryKey: preferencesQueryKey });
        toastManager.add({ title: "Content settings saved" });
      } catch (updateError) {
        toastManager.add({
          title: "Failed to save content settings",
          description: updateError instanceof Error ? updateError.message : null,
          type: "error",
        });
      }
    });
  };

  const updateLabelPreference = (label: string, preference: LabelPreference): void => {
    startSavingTransition(async () => {
      try {
        await session.agent.setContentLabelPref(label, preference);
        await queryClient.invalidateQueries({ queryKey: preferencesQueryKey });
        toastManager.add({ title: "Content settings saved" });
      } catch (updateError) {
        toastManager.add({
          title: "Failed to save content settings",
          description: updateError instanceof Error ? updateError.message : null,
          type: "error",
        });
      }
    });
  };

  let content: React.ReactNode;

  if (error) {
    content = <p className="text-fg-danger">{error.message}</p>;
  } else if (preferences) {
    content = (
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
              checked={optimisticEnabled}
              disabled={isSaving}
              onCheckedChange={updateAdultContentEnabled}
              className="flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full bg-highlight p-1 transition-colors disabled:cursor-wait disabled:opacity-60 data-checked:bg-sky-500"
            >
              <Switch.Thumb className="size-5 rounded-full bg-white transition-transform data-checked:translate-x-5" />
            </Switch.Root>
          </div>

          <div className="mt-5 divide-y divide-highlight border-t border-highlight">
            {ADULT_CONTENT_LABELS.map(([label, name]) => (
              <div key={label} className="flex items-center justify-between gap-6 py-4">
                <label htmlFor={`content-label-${label}`} className="text-sm font-medium">
                  {name}
                </label>
                <select
                  id={`content-label-${label}`}
                  value={getLabelPreference(preferences.moderationPrefs.labels, label)}
                  disabled={!optimisticEnabled || isSaving}
                  onChange={(event) =>
                    updateLabelPreference(label, event.target.value as LabelPreference)
                  }
                  className="h-9 min-w-28 rounded-md border border-highlight bg-filling px-3 text-sm disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {LABEL_PREFERENCES.map(([value, name]) => (
                    <option key={value} value={value}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </section>
      </Card>
    );
  } else {
    content = <LoadingFallback />;
  }

  return <div className="flex flex-col gap-2 py-2 tablet:gap-4 tablet:py-4">{content}</div>;
}
