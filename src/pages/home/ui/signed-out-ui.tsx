import React from "react";

import { useSignIn } from "#src/shared/auth/index.ts";
import Container from "#src/shared/ui/container.tsx";

import SignInForm from "./sign-in-form";

export default function SignedOutUI(): React.ReactElement {
  const signIn = useSignIn();

  return (
    <div className="grid grid-cols-1 items-center">
      <div>
        <Container>
          <p className="w-full py-4 text-center">
            <span className="font-brand font-medium">Woodpecker</span> is Bluesky client app.
          </p>
        </Container>

        <Container width="mobile">
          <SignInForm action={signIn} />
        </Container>
      </div>
    </div>
  );
}
