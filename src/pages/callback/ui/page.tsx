import type React from "react";
import { Suspense, useEffect } from "react";
import { Link, useNavigate } from "react-router";

import { useSession } from "#src/shared/auth/index.ts";
import LoadingFallback from "#src/shared/ui/loading-fallback.tsx";
import { Header } from "#src/widgets/header/index.ts";

export default function Page(): React.ReactElement {
  return (
    <div className="flex min-h-dvh flex-col">
      <Header />

      <Suspense fallback={<LoadingFallback />}>
        <Content />
      </Suspense>
    </div>
  );
}

function Content(): React.ReactElement {
  const navigate = useNavigate();
  const session = useSession();
  const isAuthenticated = session != null;

  useEffect(() => {
    if (isAuthenticated) {
      void navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return (
    <>
      {isAuthenticated ? (
        <LoadingFallback />
      ) : (
        <div className="grid grow grid-cols-1 grid-rows-1 place-items-center px-5 py-4">
          <div className="flex flex-col items-center gap-3">
            <p>ログインに失敗しました</p>
            <Link to="/">ホームに戻る</Link>
          </div>
        </div>
      )}
    </>
  );
}
