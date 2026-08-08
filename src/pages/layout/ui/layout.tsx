import React, { Suspense } from "react";
import { Outlet } from "react-router";

import ErrorBoundary from "#src/shared/ui/error-boundary.tsx";
import LoadingFallback from "#src/shared/ui/loading-fallback.tsx";

import Header from "./header";

export default function Layout(): React.ReactElement {
  return (
    <div className="flex min-h-dvh flex-col">
      <Header />

      <ErrorBoundary>
        <Suspense fallback={<LoadingFallback />}>
          <Outlet />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}
