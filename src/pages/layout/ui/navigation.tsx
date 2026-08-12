import React from "react";
import { Link } from "react-router";

import {
  BookmarkIcon,
  FavoriteIcon,
  HomeIcon,
  NotificationsIcon,
  SearchIcon,
} from "#src/shared/ui/icon/index.ts";

export function Navigation(): React.ReactElement {
  return (
    <div className="sticky top-0 w-20 laptop:w-46">
      <div className="flex h-15 items-center justify-center">
        <img src="/favicon.webp" alt="" width="24" height="24" />
      </div>

      <nav>
        <ul className="grid grid-flow-row auto-rows-15 grid-cols-1 justify-items-stretch">
          <li className="grid px-2 laptop:px-4">
            <Link
              to="/"
              className="flex w-full items-center justify-center gap-2 text-inherit laptop:justify-start"
            >
              <HomeIcon className="size-6" />
              <span className="max-laptop:hidden">Home</span>
            </Link>
          </li>

          <li className="grid px-2 laptop:px-4">
            <Link
              to="/search"
              className="flex w-full items-center justify-center gap-2 text-inherit laptop:justify-start"
            >
              <SearchIcon className="size-6" />
              <span className="max-laptop:hidden">Search</span>
            </Link>
          </li>

          <li className="grid px-2 laptop:px-4">
            <Link
              to="/notifications"
              className="flex w-full items-center justify-center gap-2 text-inherit laptop:justify-start"
            >
              <NotificationsIcon className="size-6" />
              <span className="max-laptop:hidden">Notifications</span>
            </Link>
          </li>

          <li className="grid px-2 laptop:px-4">
            <Link
              to="/likes"
              className="flex w-full items-center justify-center gap-2 text-inherit laptop:justify-start"
            >
              <FavoriteIcon className="size-6" />
              <span className="max-laptop:hidden">Likes</span>
            </Link>
          </li>

          <li className="grid px-2 laptop:px-4">
            <Link
              to="/bookmarks"
              className="flex w-full items-center justify-center gap-2 text-inherit laptop:justify-start"
            >
              <BookmarkIcon className="size-6" />
              <span className="max-laptop:hidden">Bookmarks</span>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
