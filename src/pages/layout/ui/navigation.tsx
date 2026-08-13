import clsx from "clsx";
import React from "react";
import { Link, useMatch } from "react-router";

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
      <div className="flex h-height-header items-center justify-center gap-2 px-6 laptop:justify-start">
        <img src="/favicon.webp" alt="Woodpecker" width="24" height="24" />
        <span className="font-brand font-medium max-laptop:hidden" aria-hidden>
          Woodpecker
        </span>
      </div>

      <nav aria-label="Main navigation" className="mt-2 tablet:mt-4">
        <ul className="grid grid-flow-row auto-rows-auto grid-cols-1 justify-items-stretch gap-2">
          <Item to="/" name="Home" icon={HomeIcon} />
          <Item to="/search" name="Search" icon={SearchIcon} />
          <Item to="/notifications" name="Notifications" icon={NotificationsIcon} />
          <Item to="/likes" name="Likes" icon={FavoriteIcon} />
          <Item to="/bookmarks" name="Bookmarks" icon={BookmarkIcon} />
        </ul>
      </nav>
    </div>
  );
}

function Item({
  to,
  name,
  icon: Icon,
}: {
  to: string;
  name: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}): React.ReactElement {
  const isCurrent = useMatch({ path: to });

  return (
    <li className="grid px-2 laptop:px-4">
      <Link
        to={to}
        aria-current={isCurrent ? "page" : void 0}
        className={clsx(
          "flex h-12 w-full items-center justify-center gap-2 rounded-full px-2 text-inherit hover:bg-highlight laptop:justify-start",
          { "bg-filling": isCurrent },
        )}
      >
        <Icon className="size-6" />
        <span className="text-sm max-laptop:hidden">{name}</span>
      </Link>
    </li>
  );
}
