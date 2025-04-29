import type { AtpAgent } from "@atproto/api";
import type React from "react";
import { createContext } from "react";

export const AtpAgentContext = createContext<AtpAgent | null>(null);

export const SetAtpAgentContext = createContext<
  React.Dispatch<React.SetStateAction<AtpAgent | null>>
>(() => {
  // do nothing
});
