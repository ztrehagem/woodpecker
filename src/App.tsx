import type React from "react";
import { BrowserOAuthClient, type ClientMetadata } from "@atproto/oauth-client-browser";
import atpClientMetadata from "../public/atp-client-metadata.json";

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
          {oauthResult.state ? (
            <div>
              {oauthResult.session.sub} was successfully authenticated (state: {oauthResult.state})
            </div>
          ) : (
            <div>{oauthResult.session.sub} was restored (last active session)</div>
          )}
          <SignOutForm sub={oauthResult.session.sub} />
        </div>
      ) : (
        <SignInForm />
      )}
    </>
  );
}

function SignInForm(): React.ReactElement {
  const action = async (fd: FormData) => {
    const handle = (fd.get("handle") as string).trim();

    try {
      await oauthClient.signIn(handle, {
        state: "DUMMY_STATE",
      });
      // Never executed
    } catch (error) {
      console.log('The user aborted the authorization process by navigating "back"', error);
    }
  };

  return (
    <form
      action={action}
      noValidate
      name="signin"
      style={{
        display: "inline-grid",
        gap: "8px 12px",
        grid: "auto-flow auto / repeat(2, auto)",
      }}
    >
      <label htmlFor="handle">Handle *</label>
      <input type="text" id="handle" name="handle" placeholder="user.bsky.social" required />
      <button type="submit">Sign In</button>
    </form>
  );
}

function SignOutForm({ sub }: { sub: string }): React.ReactElement {
  const signOut = async () => {
    await oauthClient.revoke(sub);
    location.reload();
  };

  return (
    <button type="button" onClick={signOut}>
      Sign Out
    </button>
  );
}
