import type React from "react";

import { useSession } from "#src/shared/auth/index.ts";

import { SignedInHeader } from "./signed-in-header";
import { SignedOutHeader } from "./signed-out-header";

export function Header(): React.ReactElement {
  const session = useSession();
  const isAuthenticated = session != null;

  return isAuthenticated ? <SignedInHeader /> : <SignedOutHeader />;
}
