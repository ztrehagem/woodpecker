import { useContext } from "react";

import { AtpAgentContext } from "./context";

/** @public */
export function useAuthState(): boolean {
  const agent = useContext(AtpAgentContext);
  return agent != null;
}
