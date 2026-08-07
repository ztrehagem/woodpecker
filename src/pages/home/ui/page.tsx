import type React from "react";

import { useSession } from "#src/shared/auth/index.ts";
import { Header } from "#src/widgets/header/index.ts";

import SignedInView from "./signed-in-view";
import SignedOutView from "./signed-out-view";

export default function Page(): React.ReactElement {
  const session = useSession();
  const isAuthenticated = session != null;

  return (
    <div className="flex min-h-dvh flex-col">
      <Header />

      {isAuthenticated ? <SignedInView /> : <SignedOutView />}
    </div>
  );
}
