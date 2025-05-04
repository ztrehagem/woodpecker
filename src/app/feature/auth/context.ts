import { AtpAgent } from "@atproto/api";
import type React from "react";
import { createContext } from "react";

export const AtpAgentContext = createContext<AtpAgent | null>(await resume());

export const SetAtpAgentContext = createContext<
  React.Dispatch<React.SetStateAction<AtpAgent | null>>
>(() => {
  // do nothing
});

async function resume() {
  return null;
}
