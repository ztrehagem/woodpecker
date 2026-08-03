import type React from "react";
import { Link } from "react-router";

import { useOAuthResult } from "#src/features/auth/index.ts";

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
        </div>
      ) : (
        <p>Callback failed</p>
      )}

      <Link to="/">Go back to the home</Link>
    </>
  );
}
