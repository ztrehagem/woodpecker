import { lazy } from "react";
import { createBrowserRouter } from "react-router";

import Layout from "#src/pages/layout/index.ts";

export const router = createBrowserRouter([
  {
    Component: Layout,
    children: [
      {
        path: "/",
        Component: lazy(() => import("#src/pages/home/index.ts")),
      },
      {
        path: "/callback",
        Component: lazy(() => import("#src/pages/callback/index.ts")),
      },
      {
        path: "/profile/:handle",
        Component: lazy(() => import("#src/pages/profile/index.ts")),
      },
      {
        path: "/post/:uri",
        Component: lazy(() => import("#src/pages/post/index.ts")),
      },
      {
        path: "/*",
        Component: lazy(() => import("#src/pages/not-found/index.ts")),
      },
    ],
  },
]);
