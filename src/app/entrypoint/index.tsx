import { Toast } from "@base-ui/react";
import { QueryClientProvider } from "@tanstack/react-query";

import "../styles/globals.css";
import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router/dom";

import { AtProtoProvider } from "#src/shared/auth/index.ts";
import ErrorBoundary from "#src/shared/ui/error-boundary.tsx";
import LoadingFallback from "#src/shared/ui/loading-fallback.tsx";
import { ReloadPrompt } from "#src/shared/ui/reload-prompt.tsx";
import { ToastRenderer } from "#src/shared/ui/toast.tsx";

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
          <Toast.Provider>
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
            <ToastRenderer />
          </Toast.Provider>
        </AtProtoProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  </StrictMode>,
);
