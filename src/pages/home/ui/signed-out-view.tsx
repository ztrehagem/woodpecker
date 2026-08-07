import React from "react";

import { useSignIn } from "../api/use-sign-in";
import SignInForm from "./sign-in-form";

export default function SignedOutView(): React.ReactElement {
  const signIn = useSignIn();

  return (
    <div className="grid grow grid-cols-1 grid-rows-1 place-items-center px-5 py-4">
      <SignInForm action={signIn} />
    </div>
  );
}
