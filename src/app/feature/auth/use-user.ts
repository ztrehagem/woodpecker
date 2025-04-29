import { useContext } from "react";

import { AtpAgentContext } from "./context";
import { createUserFromAtpSession, type User } from "./user";

/** @public */
export function useUser(): User | null {
  const agent = useContext(AtpAgentContext);

  const session = agent?.session;

  if (session) {
    return createUserFromAtpSession(session);
  } else {
    return null;
  }
}
