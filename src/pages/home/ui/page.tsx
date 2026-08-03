import type React from "react";
import {
  SignInForm,
  SignOutForm,
  useOAuthClient,
  useOAuthResult,
} from "#src/features/auth/index.ts";

export default function Page(): React.ReactElement {
  const oauthClient = useOAuthClient();
  const oauthResult = useOAuthResult();

  return (
    <>
      <h1>Woodpecker</h1>

      <hr />

      {oauthResult ? (
        <div>
          <p>
            You are authenticated as <code>{oauthResult.session.sub}</code>
          </p>
          <SignOutForm
            action={async () => {
              await oauthClient.revoke(oauthResult.session.sub);
              location.reload();
            }}
          />
        </div>
      ) : (
        <SignInForm
          action={async (params) => {
            await oauthClient.signIn(params.handle, {
              state: "DUMMY_STATE",
            });
          }}
        />
      )}
    </>
  );
}
