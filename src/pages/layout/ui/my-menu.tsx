import { Menu } from "@base-ui/react/menu";
import clsx from "clsx";
import React, { useState } from "react";
import { Link } from "react-router";

import type { app } from "#src/shared/api/lexicons/index.ts";
import { useSignOut } from "#src/shared/auth/index.ts";
import { AlertDialog } from "#src/shared/ui/alert-dialog.tsx";
import { AccountCircleIcon, LogoutIcon } from "#src/shared/ui/icon/index.ts";

export function MyMenu({
  profile,
}: {
  profile: app.bsky.actor.defs.ProfileViewDetailed;
}): React.ReactElement {
  const [isShowingSignOutConfirmation, setIsShowingSignOutConfirmation] = useState(false);
  const signOut = useSignOut();
  const onConfirmSignOut = async () => {
    await signOut();
    setIsShowingSignOutConfirmation(false);
  };

  const itemClassName = clsx(
    "flex cursor-pointer items-center gap-2 px-5 py-3 text-sm text-inherit hover:bg-highlight",
  );

  return (
    <>
      <Menu.Root>
        <Menu.Trigger
          className="size-10 overflow-clip rounded-full"
          render={(props, _state) => <button type="button" {...props} />}
        >
          <img
            src={profile.avatar}
            alt={profile.displayName}
            width="40"
            height="40"
            className="cursor-pointer"
          />
        </Menu.Trigger>
        <Menu.Portal className="relative z-(--index-overlay)">
          <Menu.Positioner align="end" sideOffset={8}>
            <Menu.Popup className="relative rounded-md border border-highlight bg-filling/75 py-2 backdrop-blur-sm">
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
          onConfirm={onConfirmSignOut}
          title="Are you sure you want to log out?"
          cancel="Cancel"
          confirm="Logout"
          destructive
        />
      )}
    </>
  );
}
