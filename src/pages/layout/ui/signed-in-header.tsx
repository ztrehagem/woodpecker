import React, { Suspense } from "react";

import { NewPostDialog } from "#src/entities/post/index.ts";
import { useProfileQuery } from "#src/entities/profile/index.ts";
import { useAssertSession } from "#src/shared/auth/index.ts";
import { EditSquareIcon, MenuIcon } from "#src/shared/ui/icon/index.ts";

import { MyMenu } from "./my-menu";
import { NavigationDrawer } from "./navigation-drawer";
import { PageHeading } from "./page-heading";

export function SignedInHeader(): React.ReactElement {
  return (
    <header className="sticky top-0 left-0 z-10 bg-backdrop/50 backdrop-blur-sm">
      <div className="flex h-height-header items-stretch justify-between gap-4 max-mobile:gap-2">
        <div className="flex items-center gap-4">
          <NavigationDrawer
            trigger={
              <NavigationDrawer.Trigger
                className="flex size-10 shrink-0 cursor-pointer items-center justify-center font-bold tablet:hidden"
                render={(props) => <button type="button" {...props} />}
              >
                <MenuIcon aria-label="Menu" />
              </NavigationDrawer.Trigger>
            }
          />

          <PageHeading />
        </div>

        <div className="flex items-center justify-end gap-4 max-mobile:gap-2">
          <NewPostButton />
          <MySelfButton />
        </div>
      </div>
    </header>
  );
}

function NewPostButton(): React.ReactElement {
  return (
    <NewPostDialog.Trigger
      className="flex size-10 shrink-0 cursor-pointer items-center justify-center font-bold"
      render={(props) => <button type="button" {...props} />}
    >
      <EditSquareIcon />
    </NewPostDialog.Trigger>
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
