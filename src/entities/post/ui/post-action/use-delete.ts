import type { AtUriString } from "@atproto/lex";
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
  onConfirm: () => void;
} {
  const session = useAssertSession();
  const invalidateTimelineQuery = useInvalidateTimelineQuery();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { mutate } = useMutation({
    mutationFn: async ({ uri }: { uri: AtUriString }): Promise<void> => {
      await deletePost(session, uri);
    },
    onSuccess: () => {
      void invalidateTimelineQuery();
    },
  });

  const onClick = () => {
    setIsDialogOpen(true);
  };

  const onConfirm = () => {
    mutate({ uri: postView.uri });
    setIsDialogOpen(false);
  };

  return {
    isDialogOpen,
    setIsDialogOpen,
    onClick,
    onConfirm,
  };
}
