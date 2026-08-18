import { Drawer, Menu } from "@base-ui/react";
import { useContext } from "react";

import { ActionMenuContext } from "./action-menu-context";

type Props = React.ComponentProps<typeof Drawer.Trigger> &
  React.ComponentProps<typeof Menu.Trigger>;

export function Trigger(props: Props): React.ReactElement {
  const { type } = useContext(ActionMenuContext);

  switch (type) {
    case "drawer":
      return <Drawer.Trigger {...props} />;

    case "menu":
      return <Menu.Trigger {...props} />;
  }
}
