import { Toast } from "@base-ui/react";
import { startTransition, useOptimistic, useSyncExternalStore } from "react";

import type { app } from "#src/shared/api/lexicons/index.ts";
import { useAssertSession } from "#src/shared/auth/index.ts";

import { savePost } from "../../api/save-post";
import { unsavePost } from "../../api/unsave-post";

export function useBookmark(postView: app.bsky.feed.defs.PostView): {
  isSaved: boolean;
  save: () => void;
  unsave: () => void;
} {
  const session = useAssertSession();
  const toastManager = Toast.useToastManager();

  const isSavedCache = useSyncExternalStore(session.bookmarkCache.subscribe, () =>
    session.bookmarkCache.get(postView),
  );
  const [isSavedOptimistic, setIsSavedOptimistic] = useOptimistic(isSavedCache);

  const save = (): void => {
    if (isSavedCache) {
      return;
    }
    startTransition(async () => {
      setIsSavedOptimistic(true);
      await savePost(session, postView);
      session.bookmarkCache.set(postView, true);
      toastManager.add({
        title: "Post saved",
      });
    });
  };

  const unsave = (): void => {
    if (!isSavedCache) {
      return;
    }
    startTransition(async () => {
      setIsSavedOptimistic(false);
      await unsavePost(session, postView);
      session.bookmarkCache.set(postView, false);
      toastManager.add({
        title: "Removed from saved posts",
      });
    });
  };

  return { isSaved: isSavedOptimistic, save, unsave };
}
