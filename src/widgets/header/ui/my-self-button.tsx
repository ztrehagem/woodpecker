import { Menu } from "@base-ui/react/menu";
import clsx from "clsx";
import React from "react";
import { Link } from "react-router";

import type { Profile } from "#src/entities/profile/index.ts";
import { useSignOut } from "#src/features/auth/index.ts";
import { AccountCircleIcon, LogoutIcon } from "#src/shared/ui/icon/index.ts";

export default function MySelfButton({ profile }: { profile: Profile }): React.ReactElement {
  const signOut = useSignOut();

  const itemClassName = clsx(
    "flex cursor-pointer items-center gap-2 px-5 py-2 text-inherit hover:bg-highlight",
  );

  return (
    <Menu.Root>
      <Menu.Trigger render={(props, _state) => <button type="button" {...props} />}>
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
          <Menu.Popup className="relative rounded-md bg-filling py-2 shadow-2xl">
            <Menu.Item
              className={itemClassName}
              render={(props) => <Link to={`/profile/${profile.handle}`} {...props} />}
            >
              <AccountCircleIcon />
              プロフィール
            </Menu.Item>

            {/* <Menu.Item className={itemClassName}>
              <SettingsIcon />
              設定
            </Menu.Item> */}

            <Menu.Item onClick={signOut} className={itemClassName}>
              <LogoutIcon />
              ログアウト
            </Menu.Item>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
}
