import type React from "react";

import { useSession } from "#src/shared/auth/index.ts";

import SignedInView from "./signed-in-view";
import SignedOutView from "./signed-out-view";

export default function Page(): React.ReactElement {
  const session = useSession();
  const isAuthenticated = session != null;

  return <>{isAuthenticated ? <SignedInView /> : <SignedOutView />}</>;
}
