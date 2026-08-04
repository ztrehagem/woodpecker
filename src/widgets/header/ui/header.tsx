import clsx from "clsx";
import type React from "react";
import { Suspense, useActionState } from "react";
import { Link } from "react-router";

import { useCachedClient, useOAuthClient, useOAuthResult } from "#src/features/auth/index.ts";
import { LoadingDotsIcon, LogoutIcon } from "#src/shared/ui/icon/index.ts";
import Tooltip from "#src/shared/ui/tooltip.tsx";

export default function Header(): React.ReactElement {
  return (
    <header className="pointer-events-none sticky top-0 left-0 z-10 flex h-15 items-stretch justify-between">
      <h1 className="font-brand text-lg font-medium">
        <Link
          to="/"
          className="pointer-events-auto flex h-full items-center gap-2 rounded-br-xl border-r border-b px-5 text-inherit no-underline backdrop-blur-sm focus-visible:border-blue-400 focus-visible:outline-none"
        >
          <img src="/favicon.webp" alt="" width="24" height="24" />
          Woodpecker
        </Link>
      </h1>

      <Suspense>
        <Secondary />
      </Suspense>
    </header>
  );
}

function Secondary(): React.ReactElement {
  const oauthResult = useOAuthResult();
  return (
    <>
      {oauthResult && (
        <Tooltip.Provider>
          <div className="pointer-events-auto flex items-center">
            <SignOutButton />
          </div>
        </Tooltip.Provider>
      )}
    </>
  );
}

function SignOutButton(): React.ReactElement {
  const oauthClient = useOAuthClient();
  const client = useCachedClient();

  const [, dispatch, isPending] = useActionState<void, FormData>(
    async () => {
      await oauthClient.revoke(client.did);
      location.assign("/");
      await Promise.race([]); // never resolve, so the page doesn't re-render after the redirect
    },
    void 0,
  );

  return (
    <form action={dispatch} noValidate name="signout">
      <Tooltip
        className="relative cursor-pointer justify-self-end rounded-full border border-transparent px-3 py-2 focus-visible:border-blue-400 focus-visible:outline-none"
        render={(props, _state) => <button type="submit" disabled={isPending} {...props} />}
        side="left"
        tooltip="ログアウト"
      >
        {isPending && (
          <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <LoadingDotsIcon />
          </span>
        )}
        <span className={clsx("flex items-center", isPending && "invisible")}>
          <LogoutIcon />
        </span>
      </Tooltip>
    </form>
  );
}
