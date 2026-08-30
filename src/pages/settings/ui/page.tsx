import type { LabelPreference } from "@atproto/api";
import { Toast } from "@base-ui/react";
import React, { useOptimistic, useTransition } from "react";

import { useInvalidatePreferencesQuery, usePreferencesQuery } from "#src/shared/api/index.ts";
import { useAssertSession } from "#src/shared/auth/index.ts";
import { useGlobalLoadingIndicatorEffect } from "#src/shared/ui/global-loading-indicator/index.ts";
import LoadingFallback from "#src/shared/ui/loading-fallback.tsx";

import { ContentVisibilitySettings } from "./content-visibility-settings.tsx";

export function Page(): React.ReactElement {
  const session = useAssertSession();
  const invalidatePreferencesQuery = useInvalidatePreferencesQuery();
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
        await invalidatePreferencesQuery();
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
        await invalidatePreferencesQuery();
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
      <ContentVisibilitySettings
        adultContentEnabled={optimisticEnabled}
        labels={preferences.moderationPrefs.labels}
        isSaving={isSaving}
        onAdultContentEnabledChange={updateAdultContentEnabled}
        onLabelPreferenceChange={updateLabelPreference}
      />
    );
  } else {
    content = <LoadingFallback />;
  }

  return <div className="flex flex-col gap-2 py-2 tablet:gap-4 tablet:py-4">{content}</div>;
}
