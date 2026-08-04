import type React from "react";
import { Suspense } from "react";
import { Link } from "react-router";

import { useCachedClient, useOAuthResult } from "#src/features/auth/index.ts";

import MySelfButton from "./my-self-button";

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
        <div className="pointer-events-auto flex items-center gap-2 px-5">
          <MySelfButtonView />
        </div>
      )}
    </>
  );
}

function MySelfButtonView(): React.ReactElement {
  const client = useCachedClient();
  const profile = client.getProfile();

  return (
    <Suspense>
      <MySelfButton profile={profile} />
    </Suspense>
  );
}
