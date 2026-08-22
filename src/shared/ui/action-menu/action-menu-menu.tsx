import { Menu } from "@base-ui/react";
import React from "react";

import { ActionMenuContext } from "./action-menu-context";

export function ActionMenuMenu({
  children,
  trigger,
}: React.PropsWithChildren<{ trigger: React.ReactNode }>): React.ReactElement {
  return (
    <ActionMenuContext value={{ type: "menu" }}>
      <Menu.Root>
        {trigger}

        <Menu.Portal className="relative z-(--index-overlay)">
          <Menu.Positioner side="bottom" sideOffset={8} align="end">
            <Menu.Popup className="relative rounded-md border border-highlight bg-filling/75 py-2 backdrop-blur-sm">
              {children}
            </Menu.Popup>
          </Menu.Positioner>
        </Menu.Portal>
      </Menu.Root>
    </ActionMenuContext>
  );
}
