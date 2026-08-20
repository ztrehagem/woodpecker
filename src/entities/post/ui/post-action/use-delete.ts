import { Toast } from "@base-ui/react";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

import type { app } from "#src/shared/api/lexicons/index.ts";
import { useAssertSession } from "#src/shared/auth/index.ts";

import { deletePost } from "../../api/delete-post";
import { useInvalidateTimelineQuery } from "../../api/timeline-query";

export function useDelete(postView: app.bsky.feed.defs.PostView): {
  isDialogOpen: boolean;
  setIsDialogOpen: (isOpen: boolean) => void;
  onClick: () => void;
  onConfirm: () => Promise<void>;
} {
  const toastManager = Toast.useToastManager();
  const session = useAssertSession();
  const invalidateTimelineQuery = useInvalidateTimelineQuery();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { mutateAsync } = useMutation({
    mutationFn: async () => {
      await deletePost(session, postView.uri);
    },
    onSuccess: () => {
      setIsDialogOpen(false);
      void invalidateTimelineQuery();
    },
    onError: (error) => {
      toastManager.add({
        title: "Failed to delete post",
        description: error instanceof Error ? error.message : "An unknown error occurred.",
        type: "error",
      });
    },
  });

  const onClick = () => {
    setIsDialogOpen(true);
  };

  return {
    isDialogOpen,
    setIsDialogOpen,
    onClick,
    onConfirm: mutateAsync,
  };
}
