import { useCallback, useContext } from "react";

import { SetAuthStateContext } from "./context";

export type Login = () => void;

/** @public */
export function useLogin(): Login {
  const setAuthenticated = useContext(SetAuthStateContext);

  return useCallback(() => {
    setAuthenticated(true);
  }, [setAuthenticated]);
}
