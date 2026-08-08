import React, { Suspense } from "react";
import { Link } from "react-router/internal/react-server-client";

import { NewPostDialog } from "#src/entities/post/index.ts";
import { useProfileQuery } from "#src/entities/profile/index.ts";
import { useAssertSession } from "#src/shared/auth/index.ts";
import Container from "#src/shared/ui/container.tsx";
import { EditSquareIcon } from "#src/shared/ui/icon/edit-square.tsx";
import { HomeIcon } from "#src/shared/ui/icon/home.tsx";

import { MyMenu } from "./my-menu";

export function SignedInHeader(): React.ReactElement {
  return (
    <header className="pointer-events-none sticky top-0 left-0 z-10">
      <Container>
        <div className="flex h-15 items-stretch justify-between">
          <h1 className="flex items-center font-brand text-lg font-medium">
            <Link
              to="/"
              className="pointer-events-auto flex size-10 items-center justify-center text-inherit no-underline"
              aria-label="Woodpecker"
              aria-description="Go to home"
            >
              <HomeIcon />
            </Link>
          </h1>

          <div className="pointer-events-auto flex items-center gap-4">
            <NewPostButton />
            <MySelfButton />
          </div>
        </div>
      </Container>
    </header>
  );
}

function NewPostButton(): React.ReactElement {
  return (
    <NewPostDialog
      trigger={
        <NewPostDialog.Trigger
          className="flex size-10 cursor-pointer items-center justify-center font-bold"
          render={(props) => <button type="button" {...props} />}
        >
          <EditSquareIcon />
        </NewPostDialog.Trigger>
      }
    />
  );
}

function MySelfButton(): React.ReactElement {
  const session = useAssertSession();
  const { data: profile } = useProfileQuery(session, session.did);

  const fallback = <div className="size-10 rounded-full bg-highlight"></div>;

  return (
    <>
      {profile ? (
        <Suspense fallback={fallback}>
          <MyMenu profile={profile} />
        </Suspense>
      ) : (
        fallback
      )}
    </>
  );
}
