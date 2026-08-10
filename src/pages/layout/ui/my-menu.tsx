import { Menu } from "@base-ui/react/menu";
import clsx from "clsx";
import React, { useState } from "react";
import { Link } from "react-router";

import type { Profile } from "#src/entities/profile/index.ts";
import { useSignOut } from "#src/shared/auth/index.ts";
import { AlertDialog } from "#src/shared/ui/alert-dialog.tsx";
import { AccountCircleIcon, LogoutIcon } from "#src/shared/ui/icon/index.ts";

export function MyMenu({ profile }: { profile: Profile }): React.ReactElement {
  const [isShowingSignOutConfirmation, setIsShowingSignOutConfirmation] = useState(false);
  const signOut = useSignOut();

  const itemClassName = clsx(
    "flex cursor-pointer items-center gap-2 px-5 py-3 text-inherit hover:bg-highlight",
  );

  return (
    <>
      <Menu.Root>
        <Menu.Trigger
          className="size-10"
          render={(props, _state) => <button type="button" {...props} />}
        >
          <img
            src={profile.avatar}
            alt={profile.displayName}
            width="40"
            height="40"
            className="cursor-pointer rounded-full"
          />
        </Menu.Trigger>
        <Menu.Portal className="relative z-50">
          <Menu.Positioner align="end" sideOffset={8}>
            <Menu.Popup className="relative rounded-md border bg-filling/75 py-2 shadow-2xl backdrop-blur-sm">
              <Menu.Item
                className={itemClassName}
                render={(props) => <Link to={`/profile/${profile.handle}`} {...props} />}
              >
                <AccountCircleIcon />
                Profile
              </Menu.Item>

              <Menu.Item
                onClick={() => setIsShowingSignOutConfirmation(true)}
                className={itemClassName}
              >
                <LogoutIcon />
                Logout
              </Menu.Item>
            </Menu.Popup>
          </Menu.Positioner>
        </Menu.Portal>
      </Menu.Root>

      {isShowingSignOutConfirmation && (
        <AlertDialog
          open={isShowingSignOutConfirmation}
          onOpenChange={setIsShowingSignOutConfirmation}
          onConfirm={signOut}
          title="Are you sure you want to log out?"
          cancel="Cancel"
          confirm="Logout"
          destructive
        />
      )}
    </>
  );
}
