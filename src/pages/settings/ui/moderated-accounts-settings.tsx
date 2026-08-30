import { AtUri } from "@atproto/api";
import { Toast } from "@base-ui/react";
import React, { startTransition, useState } from "react";
import { Link } from "react-router";

import { app } from "#src/shared/api/lexicons/index.ts";
import type { Session } from "#src/shared/auth/index.ts";
import { fallbackDisplayName } from "#src/shared/lib/display-name.ts";
import Card from "#src/shared/ui/card.tsx";
import { useGlobalLoadingIndicatorEffect } from "#src/shared/ui/global-loading-indicator/index.ts";
import { PersonIcon } from "#src/shared/ui/icon/index.ts";
import LoadingFallback from "#src/shared/ui/loading-fallback.tsx";
import { NakedButton } from "#src/shared/ui/naked-button.tsx";

import {
  useBlockedAccountsQuery,
  useInvalidateBlockedAccountsQuery,
  useInvalidateMutedAccountsQuery,
  useMutedAccountsQuery,
} from "../api/moderated-accounts-query.ts";

type Profile = app.bsky.actor.defs.ProfileView;

interface ModeratedAccountsSettingsProps {
  session: Session;
}

export function ModeratedAccountsSettings({
  session,
}: ModeratedAccountsSettingsProps): React.ReactElement {
  const mutedQuery = useMutedAccountsQuery(session);
  const blockedQuery = useBlockedAccountsQuery(session);
  const invalidateMutedAccountsQuery = useInvalidateMutedAccountsQuery();
  const invalidateBlockedAccountsQuery = useInvalidateBlockedAccountsQuery();
  const toastManager = Toast.useToastManager();
  const [pendingDid, setPendingDid] = useState<string | null>(null);
  const isRemoving = pendingDid != null;
  useGlobalLoadingIndicatorEffect(mutedQuery.isFetching || blockedQuery.isFetching);

  const removeMute = (profile: Profile): void => {
    setPendingDid(profile.did);
    startTransition(async () => {
      try {
        await session.client.call(app.bsky.graph.unmuteActor, { actor: profile.did });
        await invalidateMutedAccountsQuery();
        toastManager.add({ title: "User unmuted" });
      } catch (error) {
        toastManager.add({
          title: "Failed to unmute user",
          description: error instanceof Error ? error.message : null,
          type: "error",
        });
      } finally {
        setPendingDid(null);
      }
    });
  };

  const removeBlock = (profile: Profile): void => {
    setPendingDid(profile.did);
    startTransition(async () => {
      try {
        if (profile.viewer?.blocking == null) {
          throw new Error("The block record could not be found.");
        }
        const { rkey } = new AtUri(profile.viewer.blocking);
        await session.client.delete(app.bsky.graph.block, { rkey });
        await invalidateBlockedAccountsQuery();
        toastManager.add({ title: "User unblocked" });
      } catch (error) {
        toastManager.add({
          title: "Failed to unblock user",
          description: error instanceof Error ? error.message : null,
          type: "error",
        });
      } finally {
        setPendingDid(null);
      }
    });
  };

  const mutedProfiles = mutedQuery.data?.pages.flatMap((page) => page.mutes);
  const blockedProfiles = blockedQuery.data?.pages.flatMap((page) => page.blocks);

  return (
    <Card>
      <section className="p-5 tablet:p-6" aria-labelledby="moderated-accounts-heading">
        <h2 id="moderated-accounts-heading" className="text-lg font-semibold">
          Moderated accounts
        </h2>

        <AccountList
          heading="Muted users"
          profiles={mutedProfiles}
          error={mutedQuery.error}
          emptyMessage="No muted users."
          actionLabel="Unmute"
          pendingDid={isRemoving ? pendingDid : null}
          onRemove={removeMute}
          hasNextPage={mutedQuery.hasNextPage}
          isFetchingNextPage={mutedQuery.isFetchingNextPage}
          onLoadMore={() => mutedQuery.fetchNextPage()}
        />

        <AccountList
          heading="Blocked users"
          profiles={blockedProfiles}
          error={blockedQuery.error}
          emptyMessage="No blocked users."
          actionLabel="Unblock"
          pendingDid={isRemoving ? pendingDid : null}
          onRemove={removeBlock}
          hasNextPage={blockedQuery.hasNextPage}
          isFetchingNextPage={blockedQuery.isFetchingNextPage}
          onLoadMore={() => blockedQuery.fetchNextPage()}
        />
      </section>
    </Card>
  );
}

interface AccountListProps {
  heading: string;
  profiles: Profile[] | undefined;
  error: Error | null;
  emptyMessage: string;
  actionLabel: "Unmute" | "Unblock";
  pendingDid: string | null;
  onRemove: (profile: Profile) => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  onLoadMore: () => void;
}

function AccountList({
  heading,
  profiles,
  error,
  emptyMessage,
  actionLabel,
  pendingDid,
  onRemove,
  hasNextPage,
  isFetchingNextPage,
  onLoadMore,
}: AccountListProps): React.ReactElement {
  let content: React.ReactNode;

  if (error) {
    content = <p className="py-4 text-sm text-fg-danger">{error.message}</p>;
  } else if (!profiles) {
    content = <LoadingFallback />;
  } else if (profiles.length === 0) {
    content = <p className="py-4 text-sm text-fg-muted">{emptyMessage}</p>;
  } else {
    content = (
      <div className="divide-y divide-highlight">
        {profiles.map((profile) => (
          <AccountListItem
            key={profile.did}
            profile={profile}
            actionLabel={actionLabel}
            processing={pendingDid === profile.did}
            disabled={pendingDid != null}
            onRemove={onRemove}
          />
        ))}
      </div>
    );
  }

  return (
    <section className="mt-5 border-t border-highlight pt-5">
      <h3 className="font-medium">{heading}</h3>
      {content}
      {hasNextPage && (
        <div className="flex justify-center pt-2">
          <NakedButton
            onClick={onLoadMore}
            disabled={isFetchingNextPage}
            processing={isFetchingNextPage}
            emphasize
          >
            Load more
          </NakedButton>
        </div>
      )}
    </section>
  );
}

interface AccountListItemProps {
  profile: Profile;
  actionLabel: "Unmute" | "Unblock";
  processing: boolean;
  disabled: boolean;
  onRemove: (profile: Profile) => void;
}

function AccountListItem({
  profile,
  actionLabel,
  processing,
  disabled,
  onRemove,
}: AccountListItemProps): React.ReactElement {
  const displayName = fallbackDisplayName(profile.displayName, profile.handle);

  return (
    <div className="flex items-center justify-between gap-3 py-3">
      <Link
        to={`/profile/${profile.handle}`}
        className="flex min-w-0 items-center gap-3 text-inherit"
      >
        <div className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-300">
          {profile.avatar != null ? (
            <img src={profile.avatar} alt="" className="size-full object-cover" />
          ) : (
            <PersonIcon width={28} height={28} />
          )}
        </div>
        <div className="grid min-w-0 grid-cols-1">
          <span className="truncate font-medium">{displayName}</span>
          <span className="truncate text-sm text-fg-muted">@{profile.handle}</span>
        </div>
      </Link>
      <NakedButton
        onClick={() => onRemove(profile)}
        disabled={disabled}
        processing={processing}
        severity="destructive"
        aria-label={`${actionLabel} ${displayName}`}
      >
        {actionLabel}
      </NakedButton>
    </div>
  );
}
