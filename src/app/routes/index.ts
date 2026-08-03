import { lazy } from "react";
import { createBrowserRouter } from "react-router";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: lazy(() => import("../../pages/home/index.ts")),
  },
  {
    path: "/callback",
    Component: lazy(() => import("../../pages/callback/index.ts")),
  },
  {
    path: "/*",
    Component: lazy(() => import("../../pages/not-found/index.ts")),
  },
]);
