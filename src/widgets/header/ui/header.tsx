import { useQuery } from "@tanstack/react-query";
import type React from "react";
import { Suspense } from "react";
import { Link } from "react-router";

import { profileQuery } from "#src/entities/profile/index.ts";
import { useAssertSession, useSession } from "#src/shared/auth/index.ts";
import { EditSquareIcon } from "#src/shared/ui/icon/index.ts";

import MySelfButton from "./my-self-button";
import { NewPostDialog } from "./new-post-dialog";

export default function Header(): React.ReactElement {
  return (
    <header className="pointer-events-none sticky top-0 left-0 z-10 tablet:px-8">
      <div className="mx-auto flex h-15 items-stretch justify-between tablet:max-w-tablet">
        <h1 className="font-brand text-lg font-medium">
          <Link
            to="/"
            className="pointer-events-auto flex h-full items-center gap-2 rounded-br-xl border-r border-b px-5 text-inherit no-underline backdrop-blur-sm tablet:rounded-b-xl tablet:border-l"
          >
            <img src="/favicon.webp" alt="" width="24" height="24" />
            Woodpecker
          </Link>
        </h1>

        <Suspense>
          <Secondary />
        </Suspense>
      </div>
    </header>
  );
}

function Secondary(): React.ReactElement {
  const session = useSession();
  const isAuthenticated = session != null;

  return (
    <>
      {isAuthenticated && (
        <div className="pointer-events-auto flex items-center gap-4 px-5 tablet:-mr-5">
          <Suspense>
            <NewPostDialog
              trigger={
                <NewPostDialog.Trigger
                  className="flex size-10 cursor-pointer items-center justify-center"
                  render={(props) => <button type="button" {...props} />}
                >
                  <EditSquareIcon />
                </NewPostDialog.Trigger>
              }
            />
          </Suspense>

          <Suspense>
            <MySelfButtonView />
          </Suspense>
        </div>
      )}
    </>
  );
}

function MySelfButtonView(): React.ReactElement {
  const session = useAssertSession();
  const { data: profile } = useQuery(profileQuery(session, session.did));

  return <>{profile && <MySelfButton profile={profile} />}</>;
}
