import type React from "react";

import { useSession } from "#src/shared/auth/index.ts";

import SignedInUI from "./signed-in-ui";
import SignedOutUI from "./signed-out-ui";

export default function Page(): React.ReactElement {
  const session = useSession();
  const isAuthenticated = session != null;

  return <>{isAuthenticated ? <SignedInUI /> : <SignedOutUI />}</>;
}
