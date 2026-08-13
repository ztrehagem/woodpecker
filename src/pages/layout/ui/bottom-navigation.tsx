import clsx from "clsx";
import React from "react";
import { Link, useMatch } from "react-router";

import { HomeIcon, SearchIcon, NotificationsIcon } from "#src/shared/ui/icon/index.ts";

export function BottomNavigation(): React.ReactElement {
  return (
    <nav
      aria-label="Bottom navigation"
      className="sticky bottom-0 -mx-x-mobile bg-backdrop/50 pb-[env(safe-area-inset-bottom)] backdrop-blur-sm tablet:hidden"
    >
      <ul className="grid h-height-bottom-navigation grid-flow-col auto-rows-fr grid-rows-1">
        <Item to="/" icon={HomeIcon} />
        <Item to="/search" icon={SearchIcon} />
        <Item to="/notifications" icon={NotificationsIcon} />
      </ul>
    </nav>
  );
}

function Item({
  to,
  icon: Icon,
}: {
  to: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}): React.ReactElement {
  const isCurrent = useMatch({ path: to }) != null;

  return (
    <li>
      <Link
        to={to}
        aria-current={isCurrent ? "page" : void 0}
        className={clsx("flex h-full w-full items-center justify-center border-b-2 text-inherit", {
          "border-link": isCurrent,
        })}
      >
        <Icon />
      </Link>
    </li>
  );
}
