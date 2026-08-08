import { QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router/dom";

import "../styles/globals.css";
import { AtProtoProvider } from "#src/shared/auth/index.ts";
import ErrorBoundary from "#src/shared/ui/error-boundary.tsx";

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
          <RouterProvider router={router} />
        </AtProtoProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  </StrictMode>,
);
