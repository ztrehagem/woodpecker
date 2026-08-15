import { Menu } from "@base-ui/react";
import clsx from "clsx";
import { useContext } from "react";

import { ActionMenuContext } from "./action-menu-context";

export function Item({
  destructive = false,
  onClick,
  children,
}: React.PropsWithChildren<{ destructive?: boolean; onClick?: () => void }>): React.ReactElement {
  const context = useContext(ActionMenuContext);

  switch (context.type) {
    case "drawer":
      return (
        <DrawerItem destructive={destructive} onClick={onClick} setIsOpen={context.setIsOpen}>
          {children}
        </DrawerItem>
      );

    case "menu":
      return (
        <MenuItem destructive={destructive} onClick={onClick}>
          {children}
        </MenuItem>
      );
  }
}

function DrawerItem({
  destructive = false,
  onClick: propOnClick,
  children,
  setIsOpen,
}: React.PropsWithChildren<{
  destructive?: boolean;
  onClick?: () => void;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}>): React.ReactElement {
  const onClick = () => {
    propOnClick?.();
    setIsOpen(false);
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        "flex w-full cursor-pointer items-center gap-2 rounded px-5 py-3 text-sm",
        destructive ? "text-fg-danger hover:bg-fill-danger" : "text-inherit hover:bg-highlight",
      )}
    >
      {children}
    </button>
  );
}

function MenuItem({
  destructive = false,
  onClick,
  children,
}: React.PropsWithChildren<{ destructive?: boolean; onClick?: () => void }>): React.ReactElement {
  return (
    <Menu.Item
      onClick={onClick}
      className={clsx(
        "flex cursor-pointer items-center gap-2 px-5 py-2 text-sm",
        destructive ? "text-fg-danger hover:bg-fill-danger" : "text-inherit hover:bg-highlight",
      )}
    >
      {children}
    </Menu.Item>
  );
}
