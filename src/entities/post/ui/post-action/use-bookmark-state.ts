import { useState } from "react";

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

  const [isSaved, setIsSaved] = useState(session.bookmarkCache.get(postView));

  const save = (): void => {
    if (session.bookmarkCache.get(postView)) {
      return;
    }
    setIsSaved(true);
    savePost(session, postView)
      .then(() => {
        session.bookmarkCache.set(postView, true);
      })
      .catch(() => {
        setIsSaved(false);
      });
  };

  const unsave = (): void => {
    if (!session.bookmarkCache.get(postView)) {
      return;
    }
    setIsSaved(false);
    unsavePost(session, postView)
      .then(() => {
        session.bookmarkCache.set(postView, false);
      })
      .catch(() => {
        setIsSaved(true);
      });
  };

  return { isSaved, save, unsave };
}
