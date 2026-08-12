import React from "react";
import { useMatches } from "react-router";

import type { RouteHandle } from "#src/shared/lib/route-handle.ts";

export function PageHeading(): React.ReactElement {
  const matches = useMatches();

  const title = matches
    .flatMap<RouteHandle>((match) => (match.handle != null ? [match.handle] : []))
    .map((handle) => handle.title)
    .findLast((title) => title != null);

  return title != null ? <h1 className="font-bold">{title}</h1> : <></>;
}
