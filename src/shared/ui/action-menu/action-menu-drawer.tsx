import { Drawer } from "@base-ui/react";
import clsx from "clsx";
import React, { useState } from "react";

import { ActionMenuContext } from "./action-menu-context";

import css from "./action-menu-drawer.module.css";

export function ActionMenuDrawer({
  children,
  trigger,
}: React.PropsWithChildren<{ trigger: React.ReactNode }>): React.ReactElement {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <ActionMenuContext value={{ type: "drawer", setIsOpen }}>
      <Drawer.Root open={isOpen} onOpenChange={setIsOpen}>
        {trigger}

        <Drawer.Portal>
          <Drawer.Backdrop className={clsx("fixed inset-0 bg-backdrop/75", css.backdrop)} />

          <Drawer.Viewport className="fixed inset-0 flex items-end justify-center">
            <Drawer.Popup
              className={clsx(
                "w-full rounded-t-lg border-t border-highlight bg-filling/75 px-4 backdrop-blur-sm",
                css.popup,
              )}
            >
              <div className="pointer-events-none mx-auto mt-3 h-1 w-10 rounded-full bg-fg-muted"></div>

              <Drawer.Content className="my-4 flex flex-col gap-1">{children}</Drawer.Content>
            </Drawer.Popup>
          </Drawer.Viewport>
        </Drawer.Portal>
      </Drawer.Root>
    </ActionMenuContext>
  );
}
