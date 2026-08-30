import { Switch, Toast } from "@base-ui/react";
import { useQueryClient } from "@tanstack/react-query";
import React, { useOptimistic, useTransition } from "react";

import { preferencesQueryKey, usePreferencesQuery } from "#src/shared/api/index.ts";
import { useAssertSession } from "#src/shared/auth/index.ts";
import Card from "#src/shared/ui/card.tsx";
import { useGlobalLoadingIndicatorEffect } from "#src/shared/ui/global-loading-indicator/index.ts";
import LoadingFallback from "#src/shared/ui/loading-fallback.tsx";

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
        </section>
      </Card>
    );
  } else {
    content = <LoadingFallback />;
  }

  return <div className="flex flex-col gap-2 py-2 tablet:gap-4 tablet:py-4">{content}</div>;
}
