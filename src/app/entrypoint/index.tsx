import { QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router/dom";

import "../styles/globals.css";
import ErrorBoundary from "#src/shared/ui/error-boundary.ts";

import { router } from "../routes";
import { queryClient } from "./query-client";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary fallback={"Something went wrong!"}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </ErrorBoundary>
  </StrictMode>,
);
