import { useContext } from "react";

import { AuthStateContext } from "./context";

/** @public */
export function useAuthState(): boolean {
  return useContext(AuthStateContext);
}
