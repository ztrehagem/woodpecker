import type React from "react";

import { useOAuthResult } from "#src/features/auth/index.ts";
import { Header } from "#src/widgets/header/index.ts";

import SignedInView from "./signed-in-view";
import SignedOutView from "./signed-out-view";

export default function Page(): React.ReactElement {
  const oauthResult = useOAuthResult();

  return (
    <div className="flex min-h-dvh flex-col">
      <Header />

      {oauthResult ? <SignedInView /> : <SignedOutView />}
    </div>
  );
}
