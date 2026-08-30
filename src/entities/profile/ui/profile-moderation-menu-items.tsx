import { AtUri } from "@atproto/api";
import { toDatetimeString } from "@atproto/lex";
import { Toast } from "@base-ui/react";
import React, { useState } from "react";

import { app } from "#src/shared/api/lexicons/index.ts";
import { useAssertSession } from "#src/shared/auth/index.ts";
import { ActionMenu } from "#src/shared/ui/action-menu/index.ts";
import { AlertDialog } from "#src/shared/ui/alert-dialog.tsx";
import { ChatBubbleOffIcon, PersonOffIcon } from "#src/shared/ui/icon/index.ts";

type Profile = Pick<app.bsky.actor.defs.ProfileView, "did" | "viewer">;

export function useProfileModerationMenu(profile: Profile): {
  dialogs: React.ReactNode;
  menuItems: React.ReactNode;
} {
  const session = useAssertSession();
  const toastManager = Toast.useToastManager();
  const [muted, setMuted] = useState(profile.viewer?.muted ?? false);
  const [blockingUri, setBlockingUri] = useState(profile.viewer?.blocking ?? null);
  const [isMuteDialogOpen, setIsMuteDialogOpen] = useState(false);
  const [isBlockDialogOpen, setIsBlockDialogOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const unmute = async (): Promise<void> => {
    setIsProcessing(true);
    try {
      await session.client.call(app.bsky.graph.unmuteActor, { actor: profile.did });
      setMuted(false);
      toastManager.add({ title: "User unmuted" });
    } catch (error) {
      toastManager.add({
        title: "Failed to unmute user",
        description: error instanceof Error ? error.message : null,
        type: "error",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const mute = async (): Promise<void> => {
    setIsProcessing(true);
    try {
      await session.client.call(app.bsky.graph.muteActor, { actor: profile.did });
      setMuted(true);
      setIsMuteDialogOpen(false);
      toastManager.add({ title: "User muted" });
    } catch (error) {
      toastManager.add({
        title: "Failed to mute user",
        description: error instanceof Error ? error.message : null,
        type: "error",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const unblock = async (): Promise<void> => {
    if (blockingUri == null) {
      return;
    }

    setIsProcessing(true);
    try {
      const { rkey } = new AtUri(blockingUri);
      await session.client.delete(app.bsky.graph.block, { rkey });
      setBlockingUri(null);
      toastManager.add({ title: "User unblocked" });
    } catch (error) {
      toastManager.add({
        title: "Failed to unblock user",
        description: error instanceof Error ? error.message : null,
        type: "error",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const block = async (): Promise<void> => {
    setIsProcessing(true);
    try {
      const { uri } = await session.client.create(app.bsky.graph.block, {
        subject: profile.did,
        createdAt: toDatetimeString(new Date()),
      });
      setBlockingUri(uri);
      setIsBlockDialogOpen(false);
      toastManager.add({ title: "User blocked" });
    } catch (error) {
      toastManager.add({
        title: "Failed to block user",
        description: error instanceof Error ? error.message : null,
        type: "error",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const menuItems =
    profile.did === session.did ? null : (
      <>
        <ActionMenu.Item
          disabled={isProcessing}
          onClick={() => {
            if (muted) {
              void unmute();
            } else {
              setIsMuteDialogOpen(true);
            }
          }}
        >
          <ChatBubbleOffIcon className="size-5" />
          {muted ? "Unmute user" : "Mute user"}
        </ActionMenu.Item>

        <ActionMenu.Item
          destructive
          disabled={isProcessing}
          onClick={() => {
            if (blockingUri == null) {
              setIsBlockDialogOpen(true);
            } else {
              void unblock();
            }
          }}
        >
          <PersonOffIcon className="size-5" />
          {blockingUri == null ? "Block user" : "Unblock user"}
        </ActionMenu.Item>
      </>
    );

  const dialogs = (
    <>
      <AlertDialog
        open={isMuteDialogOpen}
        onOpenChange={setIsMuteDialogOpen}
        onConfirm={mute}
        title="Mute User"
        description="Are you sure you want to mute this user? Their posts will be hidden from your feeds."
        cancel="Cancel"
        confirm="Mute"
      />
      <AlertDialog
        open={isBlockDialogOpen}
        onOpenChange={setIsBlockDialogOpen}
        onConfirm={block}
        title="Block User"
        description="Are you sure you want to block this user? They will not be able to interact with you."
        cancel="Cancel"
        confirm="Block"
        destructive
      />
    </>
  );

  return { dialogs, menuItems };
}
