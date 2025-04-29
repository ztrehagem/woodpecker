import type React from "react";
import { createContext } from "react";

export const AuthStateContext = createContext(false);

export const SetAuthStateContext = createContext<
  React.Dispatch<React.SetStateAction<boolean>>
>(() => {
  // do nothing
});
