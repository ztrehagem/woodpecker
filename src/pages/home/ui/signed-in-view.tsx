import { useQuery } from "@tanstack/react-query";
import React from "react";

import { TimelineView, timelineQueryOptions } from "#src/entities/timeline/index.ts";
import { useCachedClient } from "#src/features/auth/index.ts";
import Container from "#src/shared/ui/container.tsx";
import ErrorBoundary from "#src/shared/ui/error-boundary.ts";
import LoadingFallback from "#src/shared/ui/loading-fallback.tsx";

export default function SignedInView(): React.ReactElement {
  const client = useCachedClient();

  const { data: feed } = useQuery(timelineQueryOptions(client.rpc));

  return (
    <ErrorBoundary fallback={<div>Failed to load</div>}>
      <div className="py-4">
        <Container>{feed ? <TimelineView feed={feed} /> : <LoadingFallback />}</Container>
      </div>
    </ErrorBoundary>
  );
}
