import type React from "react";
import { BrowserOAuthClient, type ClientMetadata } from "@atproto/oauth-client-browser";
import atpClientMetadata from "../../public/atp-client-metadata.json";
import { SignInForm, SignOutForm } from "../features/auth";

const oauthClient = import.meta.env.DEV
  ? await BrowserOAuthClient.load({
      clientId: `http://localhost?redirect_uri=${encodeURIComponent(`${location.origin}/callback`)}`,
      handleResolver: "https://bsky.social",
    })
  : new BrowserOAuthClient({
      clientMetadata: atpClientMetadata as ClientMetadata,
      handleResolver: "https://bsky.social",
    });

const oauthResult = await oauthClient.init();

export default function App(): React.ReactElement {
  return (
    <>
      <h1>Woodpecker</h1>

      <hr />

      <div>
        <h2>Client Metadata</h2>
        <pre>{JSON.stringify(atpClientMetadata, null, 2)}</pre>
      </div>

      <hr />

      {oauthResult ? (
        <div>
          {oauthResult.state != null ? (
            <div>
              {oauthResult.session.sub} was successfully authenticated (state: {oauthResult.state})
            </div>
          ) : (
            <div>{oauthResult.session.sub} was restored (last active session)</div>
          )}
          <SignOutForm
            onSubmit={async () => {
              await oauthClient.revoke(oauthResult.session.sub);
              location.reload();
            }}
          />
        </div>
      ) : (
        <SignInForm
          onSubmit={async (params) => {
            await oauthClient.signIn(params.handle, {
              state: "DUMMY_STATE",
            });
          }}
        />
      )}
    </>
  );
}
