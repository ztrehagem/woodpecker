import { QueryClientProvider } from "@tanstack/react-query";
import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";

import "../styles/globals.css";
import { RouterProvider } from "react-router/dom";

import { AtProtoProvider } from "#src/shared/auth/index.ts";
import ErrorBoundary from "#src/shared/ui/error-boundary.tsx";
import LoadingFallback from "#src/shared/ui/loading-fallback.tsx";
import { ReloadPrompt } from "#src/shared/ui/reload-prompt.tsx";

import { router } from "../routes";
import { oauthClientPromise, oauthResultPromise, sessionPromise } from "./atproto";
import { queryClient } from "./query-client";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AtProtoProvider
          oauthClient={oauthClientPromise}
          oauthResult={oauthResultPromise}
          session={sessionPromise}
        >
          <Suspense
            fallback={
              <div className="grid h-dvh grid-cols-1 grid-rows-1 place-items-center">
                <LoadingFallback />
              </div>
            }
          >
            <RouterProvider router={router} />
          </Suspense>
          <ReloadPrompt />
        </AtProtoProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  </StrictMode>,
);
