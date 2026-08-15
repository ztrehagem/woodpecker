import { Drawer, Menu } from "@base-ui/react";
import { useContext } from "react";

import { ActionMenuContext } from "./action-menu-context";

export function Trigger({ children }: React.PropsWithChildren<{}>): React.ReactElement {
  const { type } = useContext(ActionMenuContext);

  switch (type) {
    case "drawer":
      return (
        <Drawer.Trigger className="relative -m-2 flex cursor-pointer items-center gap-x-1 p-2 text-fg-muted">
          {children}
        </Drawer.Trigger>
      );

    case "menu":
      return (
        <Menu.Trigger className="relative -m-2 flex cursor-pointer items-center gap-x-1 p-2 text-fg-muted">
          {children}
        </Menu.Trigger>
      );
  }
}
