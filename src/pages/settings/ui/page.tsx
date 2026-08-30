import type { AppBskyActorDefs, LabelPreference } from "@atproto/api";
import { Toast } from "@base-ui/react";
import React, { useOptimistic, useTransition } from "react";

import { useInvalidatePreferencesQuery, usePreferencesQuery } from "#src/shared/api/index.ts";
import { useAssertSession } from "#src/shared/auth/index.ts";
import { useGlobalLoadingIndicatorEffect } from "#src/shared/ui/global-loading-indicator/index.ts";
import LoadingFallback from "#src/shared/ui/loading-fallback.tsx";

import { ContentVisibilitySettings } from "./content-visibility-settings.tsx";
import { ModeratedAccountsSettings } from "./moderated-accounts-settings.tsx";
import { MutedWordsSettings } from "./muted-words-settings.tsx";

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

  const addMutedWord = (
    value: string,
    target: "content" | "tag",
    actorTarget: "all" | "exclude-following",
    expiresAt?: string,
  ): void => {
    startSavingTransition(async () => {
      try {
        await session.agent.addMutedWord({
          value,
          targets: [target],
          actorTarget,
          expiresAt,
        });
        await invalidatePreferencesQuery();
        toastManager.add({ title: "Muted word saved" });
      } catch (updateError) {
        toastManager.add({
          title: "Failed to save muted word",
          description: updateError instanceof Error ? updateError.message : null,
          type: "error",
        });
      }
    });
  };

  const removeMutedWord = (mutedWord: AppBskyActorDefs.MutedWord): void => {
    startSavingTransition(async () => {
      try {
        await session.agent.removeMutedWords([mutedWord]);
        await invalidatePreferencesQuery();
        toastManager.add({ title: "Muted word removed" });
      } catch (updateError) {
        toastManager.add({
          title: "Failed to remove muted word",
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
      <>
        <ContentVisibilitySettings
          adultContentEnabled={optimisticEnabled}
          labels={preferences.moderationPrefs.labels}
          isSaving={isSaving}
          onAdultContentEnabledChange={updateAdultContentEnabled}
          onLabelPreferenceChange={updateLabelPreference}
        />
        <MutedWordsSettings
          mutedWords={preferences.moderationPrefs.mutedWords ?? []}
          isSaving={isSaving}
          onAdd={addMutedWord}
          onRemove={removeMutedWord}
        />
      </>
    );
  } else {
    content = <LoadingFallback />;
  }

  return (
    <div className="flex flex-col gap-2 py-2 tablet:gap-4 tablet:py-4">
      {content}
      <ModeratedAccountsSettings session={session} />
    </div>
  );
}
