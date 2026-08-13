import { Menu } from "@base-ui/react";
import { clsx } from "clsx";
import React from "react";

import { MoreHorizIcon } from "#src/shared/ui/icon/index.ts";

export function MoreMenu(): React.ReactElement {
  const itemClassName = clsx(
    "flex cursor-pointer items-center gap-2 px-5 py-2 text-sm text-inherit hover:bg-highlight",
  );

  return (
    <Menu.Root>
      <Menu.Trigger
        className="relative -m-2 flex cursor-pointer items-center gap-x-1 p-2 text-fg-muted"
        render={(props) => <button type="button" {...props} />}
      >
        <MoreHorizIcon aria-label="More" className="size-5" />
      </Menu.Trigger>

      <Menu.Portal className="relative z-50">
        <Menu.Positioner side="bottom" sideOffset={8} align="end">
          <Menu.Popup className="relative rounded-md border border-highlight bg-filling/75 py-2 backdrop-blur-sm">
            <Menu.Item className={itemClassName}>More actions (Coming soon)</Menu.Item>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
}
