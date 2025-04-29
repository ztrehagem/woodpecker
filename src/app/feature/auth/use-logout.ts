import { useCallback, useContext } from "react";

import { AtpAgentContext, SetAtpAgentContext } from "./context";

export type Logout = () => Promise<void>;

/** @public */
export function useLogout(): Logout {
  const agent = useContext(AtpAgentContext);
  const setAgent = useContext(SetAtpAgentContext);

  return useCallback(async () => {
    await agent?.sessionManager.logout();
    setAgent(null);
  }, [agent?.sessionManager, setAgent]);
}
