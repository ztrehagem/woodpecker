import type { AtpAgent } from "@atproto/api";
import { useState } from "react";

import { AtpAgentContext, SetAtpAgentContext } from "./context";

/** @public */
export default function AuthProvider({
  children,
}: Readonly<React.PropsWithChildren>): React.ReactElement {
  const [atpAgent, setAtpAgent] = useState<AtpAgent | null>(null);

  return (
    <SetAtpAgentContext value={setAtpAgent}>
      <AtpAgentContext value={atpAgent}>{children}</AtpAgentContext>
    </SetAtpAgentContext>
  );
}
