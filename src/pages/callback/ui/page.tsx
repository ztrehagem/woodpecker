import type React from "react";
import { useOAuthResult } from "#src/features/auth/index.ts";
import { Link } from "react-router";

export default function Page(): React.ReactElement {
  const oauthResult = useOAuthResult();

  return (
    <>
      <h1>Woodpecker</h1>

      {oauthResult != null ? (
        <div>
          {oauthResult.state != null ? (
            <p>
              <code>{oauthResult.session.sub}</code> was successfully authenticated (state:{" "}
              {oauthResult.state})
            </p>
          ) : (
            <p>
              <code>{oauthResult.session.sub}</code> was restored (last active session)
            </p>
          )}

          <Link to="/">Go back to the home</Link>
        </div>
      ) : (
        <div>Callback failed</div>
      )}
    </>
  );
}
