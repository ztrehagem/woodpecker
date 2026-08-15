import React from "react";

import { ActionMenuDrawer } from "./action-menu-drawer";
import { ActionMenuMenu } from "./action-menu-menu";
import { Item } from "./item";
import { Trigger } from "./trigger";

export function ActionMenu({
  trigger,
  children,
}: React.PropsWithChildren<{
  trigger: React.ReactNode;
}>): React.ReactElement {
  return (
    <>
      <div className="tablet:hidden">
        <ActionMenuDrawer trigger={trigger}>{children}</ActionMenuDrawer>
      </div>

      <div className="max-tablet:hidden">
        <ActionMenuMenu trigger={trigger}>{children}</ActionMenuMenu>
      </div>
    </>
  );
}

ActionMenu.Trigger = Trigger;
ActionMenu.Item = Item;
