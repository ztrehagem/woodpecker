import { Drawer } from "@base-ui/react";
import React, { useState } from "react";
import { Link } from "react-router";

import {
  HomeIcon,
  SearchIcon,
  NotificationsIcon,
  FavoriteIcon,
  BookmarkIcon,
} from "#src/shared/ui/icon/index.ts";

export function NavigationDrawer({ trigger }: { trigger: React.ReactNode }): React.ReactElement {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Drawer.Root swipeDirection="left" open={isOpen} onOpenChange={setIsOpen}>
      {trigger}

      <Drawer.Portal className="relative z-50">
        <Drawer.Backdrop className="fixed inset-0 bg-backdrop/75 opacity-100 transition-opacity duration-200 ease-out data-ending-style:opacity-0 data-starting-style:opacity-0" />

        <Drawer.Viewport className="fixed inset-0">
          <Drawer.Popup className="h-full w-max bg-backdrop/50 shadow-lg backdrop-blur-sm transition-transform duration-200 ease-out data-ending-style:-translate-x-full data-starting-style:-translate-x-full">
            <Content onClickLink={() => setIsOpen(false)} />
          </Drawer.Popup>
        </Drawer.Viewport>
      </Drawer.Portal>
    </Drawer.Root>
  );
}

NavigationDrawer.Trigger = Drawer.Trigger;

function Content({ onClickLink }: { onClickLink?: () => void }): React.ReactElement {
  return (
    <Drawer.Content>
      <ul className="grid grid-flow-row auto-rows-15 grid-cols-1 justify-items-stretch">
        <li className="grid px-2 laptop:px-4">
          <Link
            to="/"
            onClick={onClickLink}
            className="flex w-full items-center gap-2 px-4 text-inherit"
          >
            <HomeIcon className="size-6" />
            <span className="">Home</span>
          </Link>
        </li>

        <li className="grid px-2 laptop:px-4">
          <Link
            to="/search"
            onClick={onClickLink}
            className="flex w-full items-center gap-2 px-4 text-inherit"
          >
            <SearchIcon className="size-6" />
            <span className="">Search</span>
          </Link>
        </li>

        <li className="grid px-2 laptop:px-4">
          <Link
            to="/notifications"
            onClick={onClickLink}
            className="flex w-full items-center gap-2 px-4 text-inherit"
          >
            <NotificationsIcon className="size-6" />
            <span className="">Notifications</span>
          </Link>
        </li>

        <li className="grid px-2 laptop:px-4">
          <Link
            to="/likes"
            onClick={onClickLink}
            className="flex w-full items-center gap-2 px-4 text-inherit"
          >
            <FavoriteIcon className="size-6" />
            <span className="">Likes</span>
          </Link>
        </li>

        <li className="grid px-2 laptop:px-4">
          <Link
            to="/bookmarks"
            onClick={onClickLink}
            className="flex w-full items-center gap-2 px-4 text-inherit"
          >
            <BookmarkIcon className="size-6" />
            <span className="">Bookmarks</span>
          </Link>
        </li>
      </ul>
    </Drawer.Content>
  );
}
