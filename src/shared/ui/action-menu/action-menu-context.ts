import { createContext } from "react";

type ActionMenuContext =
  | { type: "drawer"; setIsOpen: React.Dispatch<React.SetStateAction<boolean>> }
  | { type: "menu" };

export const ActionMenuContext = createContext<ActionMenuContext>({ type: "menu" });
