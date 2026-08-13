import React, { Suspense } from "react";
import { Outlet, ScrollRestoration } from "react-router";

import { NewPostDialog } from "#src/entities/post/index.ts";
import { useSession } from "#src/shared/auth/index.ts";
import ErrorBoundary from "#src/shared/ui/error-boundary.tsx";
import LoadingFallback from "#src/shared/ui/loading-fallback.tsx";

import { BottomNavigation } from "./bottom-navigation";
import { Header } from "./header";
import { Navigation } from "./navigation";
import { NewPostFab } from "./new-post-fab";

export default function Layout(): React.ReactElement {
  const session = useSession();
  const isAuthenticated = session != null;

  return (
    <>
      <div className="grid min-h-dvh grid-cols-1 max-tablet:px-x-mobile tablet:grid-cols-[1fr_auto_1fr]">
        <div className="justify-self-end max-tablet:hidden">
          {isAuthenticated && <Navigation />}
        </div>

        <div className="flex min-h-dvh max-w-full flex-col tablet:w-column-main">
          <Header />

          <div className="grid grow grid-flow-row auto-rows-auto grid-cols-1 grid-rows-1">
            <ErrorBoundary>
              <Suspense fallback={<LoadingFallback />}>
                <Outlet />
                {isAuthenticated && (
                  <>
                    <NewPostFab />
                    <BottomNavigation />
                    <NewPostDialog />
                  </>
                )}
              </Suspense>
            </ErrorBoundary>
          </div>
        </div>

        <div className="justify-self-start max-tablet:hidden">
          <div className=""></div>
        </div>
      </div>

      <ScrollRestoration />
    </>
  );
}
