import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router/dom";

import "../styles/globals.css";
import ErrorBoundary from "#src/shared/ui/error-boundary.ts";

import { router } from "../routes";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary fallback={"Something went wrong!"}>
      <RouterProvider router={router} />
    </ErrorBoundary>
  </StrictMode>,
);
