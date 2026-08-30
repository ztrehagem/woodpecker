import { lazy } from "react";
import { createBrowserRouter } from "react-router";

import Layout from "#src/pages/layout/index.ts";
import type { RouteHandle } from "#src/shared/lib/route-handle.ts";

export const router = createBrowserRouter([
  {
    Component: Layout,
    children: [
      {
        path: "/",
        Component: lazy(() => import("#src/pages/home/index.ts")),
        handle: { title: "Home" } satisfies RouteHandle,
      },
      {
        path: "/callback",
        Component: lazy(() => import("#src/pages/callback/index.ts")),
      },
      {
        path: "/profile/:handle",
        Component: lazy(() => import("#src/pages/profile/index.ts")),
        handle: { title: "Profile" } satisfies RouteHandle,
      },
      {
        path: "/profile/:handle/follows",
        Component: lazy(() => import("#src/pages/follows/index.ts")),
        handle: { title: "Following" } satisfies RouteHandle,
      },
      {
        path: "/profile/:handle/followers",
        Component: lazy(() => import("#src/pages/followers/index.ts")),
        handle: { title: "Followers" } satisfies RouteHandle,
      },
      {
        path: "/profile/:handle/post/:postId",
        Component: lazy(() => import("#src/pages/post/index.ts")),
        handle: { title: "Post" } satisfies RouteHandle,
      },
      {
        path: "/search",
        Component: lazy(() => import("#src/pages/search/index.ts")),
        handle: { title: "Search" } satisfies RouteHandle,
      },
      {
        path: "/notifications",
        Component: lazy(() => import("#src/pages/notifications/index.ts")),
        handle: { title: "Notifications" } satisfies RouteHandle,
      },
      {
        path: "/likes",
        Component: lazy(() => import("#src/pages/likes/index.ts")),
        handle: { title: "Likes" } satisfies RouteHandle,
      },
      {
        path: "/bookmarks",
        Component: lazy(() => import("#src/pages/bookmarks/index.ts")),
        handle: { title: "Bookmarks" } satisfies RouteHandle,
      },
      {
        path: "/settings",
        Component: lazy(() => import("#src/pages/settings/index.ts")),
        handle: { title: "Settings" } satisfies RouteHandle,
      },
      {
        path: "/*",
        Component: lazy(() => import("#src/pages/not-found/index.ts")),
      },
    ],
  },
]);
