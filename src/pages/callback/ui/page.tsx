import type React from "react";
import { Suspense, useEffect } from "react";
import { Link, useNavigate } from "react-router";

import { useOAuthResult } from "#src/features/auth/index.ts";
import { LoadingBoxesIcon } from "#src/shared/ui/icon/index.ts";
import { Header } from "#src/widgets/header/index.ts";

export default function Page(): React.ReactElement {
  return (
    <div className="flex min-h-dvh flex-col">
      <Header />

      <div className="grid grow grid-cols-1 grid-rows-1 place-items-center px-5 py-4">
        <Suspense fallback={<LoadingBoxesIcon />}>
          <Content />
        </Suspense>
      </div>
    </div>
  );
}

function Content(): React.ReactElement {
  const navigate = useNavigate();
  const oauthResult = useOAuthResult();
  const isAuthenticated = oauthResult != null;

  useEffect(() => {
    if (isAuthenticated) {
      void navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return (
    <>
      {isAuthenticated ? (
        <LoadingBoxesIcon />
      ) : (
        <div className="flex flex-col items-center gap-3">
          <p>ログインに失敗しました</p>
          <Link to="/">ホームに戻る</Link>
        </div>
      )}
    </>
  );
}
