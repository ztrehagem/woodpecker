import { Drawer } from "@base-ui/react";
import clsx from "clsx";
import React, { useState } from "react";
import { Link, useMatch } from "react-router";

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
          <Drawer.Popup className="h-full w-max bg-backdrop/50 backdrop-blur-sm transition-transform duration-200 ease-out data-ending-style:-translate-x-full data-starting-style:-translate-x-full">
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
      <div className="flex h-height-header items-center justify-start gap-2 px-6">
        <img src="/favicon.webp" alt="Woodpecker" width="24" height="24" />
        <span className="font-brand font-medium" aria-hidden>
          Woodpecker
        </span>
      </div>

      <nav aria-label="Main navigation" className="mt-2 tablet:mt-4">
        <ul className="grid grid-flow-row auto-rows-auto grid-cols-1 justify-items-stretch gap-2">
          <Item to="/" name="Home" icon={HomeIcon} onClick={onClickLink} />
          <Item to="/search" name="Search" icon={SearchIcon} onClick={onClickLink} />
          <Item
            to="/notifications"
            name="Notifications"
            icon={NotificationsIcon}
            onClick={onClickLink}
          />
          <Item to="/likes" name="Likes" icon={FavoriteIcon} onClick={onClickLink} />
          <Item to="/bookmarks" name="Bookmarks" icon={BookmarkIcon} onClick={onClickLink} />
        </ul>
      </nav>
    </Drawer.Content>
  );
}

function Item({
  to,
  name,
  icon: Icon,
  onClick: onClickProp,
}: {
  to: string;
  name: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  onClick?: () => void;
}): React.ReactElement {
  const isCurrent = useMatch({ path: to });
  const isExact = useMatch({ path: to, end: true }) != null;

  const onClick = (e: React.MouseEvent) => {
    if (isExact) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    onClickProp?.();
  };

  return (
    <li className="grid px-4 laptop:px-4">
      <Link
        to={to}
        onClick={onClick}
        aria-current={isCurrent ? "page" : void 0}
        className={clsx(
          "flex h-12 w-full items-center gap-2 rounded-full px-2 text-inherit hover:bg-highlight",
          { "bg-filling": isCurrent },
        )}
      >
        <Icon className="size-6" />
        <span className="text-sm">{name}</span>
      </Link>
    </li>
  );
}
