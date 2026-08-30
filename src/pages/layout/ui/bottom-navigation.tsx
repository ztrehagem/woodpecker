import clsx from "clsx";
import React from "react";
import { Link, useMatch } from "react-router";

import { useInvalidateTimelineQuery } from "#src/entities/post/index.ts";
import { HomeIcon, SearchIcon, NotificationsIcon } from "#src/shared/ui/icon/index.ts";

export function BottomNavigation(): React.ReactElement {
  const invalidateTimelineQuery = useInvalidateTimelineQuery();
  const onExactClickHome = () => {
    void invalidateTimelineQuery({ stale: true });
  };

  return (
    <nav
      aria-label="Bottom navigation"
      className="sticky bottom-0 z-(--index-cover) -mx-x-mobile border-t border-highlight bg-backdrop/50 pb-[env(safe-area-inset-bottom)] backdrop-blur-sm tablet:hidden"
    >
      <ul className="grid h-height-bottom-navigation grid-flow-col auto-rows-fr grid-rows-1">
        <Item to="/" icon={HomeIcon} onExactClick={onExactClickHome} />
        <Item to="/search" icon={SearchIcon} />
        <Item to="/notifications" icon={NotificationsIcon} />
      </ul>
    </nav>
  );
}

function Item({
  to,
  icon: Icon,
  onExactClick,
}: {
  to: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  onExactClick?: () => void;
}): React.ReactElement {
  const isCurrent = useMatch({ path: to }) != null;
  const isExact = useMatch({ path: to, end: true }) != null;

  const onClick = (e: React.MouseEvent) => {
    if (isExact) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
      onExactClick?.();
    }
  };

  return (
    <li>
      <Link
        to={to}
        onClick={onClick}
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
