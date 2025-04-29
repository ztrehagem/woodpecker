import { lazy } from "react";
import { type RouteObject } from "react-router";

export const routes = [
  {
    Component: lazy(() => import("./root")),
    children: [
      {
        path: "/login",
        Component: lazy(() => import("./login")),
      },
      {
        path: "/",
        Component: lazy(() => import("./home")),
      },
    ],
  },
] as const satisfies RouteObject[];
