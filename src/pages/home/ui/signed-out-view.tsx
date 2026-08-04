import React from "react";

import { useOAuthClient } from "#src/features/auth/index.ts";

import SignInForm from "./sign-in-form";

export default function SignedOutView(): React.ReactElement {
  const oauthClient = useOAuthClient();

  return (
    <div className="grid grow grid-cols-1 grid-rows-1 place-items-center px-5 py-4">
      <SignInForm
        action={async (params) => {
          await oauthClient.signIn(params.handle, {
            state: "DUMMY_STATE",
          });
        }}
      />
    </div>
  );
}
