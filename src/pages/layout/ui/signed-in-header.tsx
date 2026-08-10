import React, { Suspense } from "react";
import { Link } from "react-router/internal/react-server-client";

import { NewPostDialog } from "#src/entities/post/index.ts";
import { useProfileQuery } from "#src/entities/profile/index.ts";
import { useAssertSession } from "#src/shared/auth/index.ts";
import Container from "#src/shared/ui/container.tsx";
import { EditSquareIcon, HomeIcon } from "#src/shared/ui/icon/index.ts";

import { MyMenu } from "./my-menu";

export function SignedInHeader(): React.ReactElement {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <header className="sticky top-0 left-0 z-10 bg-backdrop/50 backdrop-blur-sm">
      <Container>
        <div className="grid h-15 grid-cols-[1fr_auto_1fr] items-stretch justify-between gap-4 max-mobile:gap-2">
          <div className="flex items-center">
            <Link
              to="/"
              className="flex size-10 items-center justify-center text-inherit no-underline"
              aria-label="Woodpecker"
              aria-description="Go to home"
            >
              <HomeIcon />
            </Link>
          </div>

          <h1 className="flex items-center">
            <button
              type="button"
              onClick={scrollToTop}
              className="flex cursor-pointer items-center gap-2 font-brand text-sm font-medium"
            >
              <img src="/favicon.webp" alt="" width="16" height="16" />
              Woodpecker
            </button>
          </h1>

          <div className="flex items-center justify-end gap-4 max-mobile:gap-2">
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
          className="flex size-10 shrink-0 cursor-pointer items-center justify-center font-bold"
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
