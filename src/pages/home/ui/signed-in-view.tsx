import React, { useEffect, useSyncExternalStore } from "react";

import { TimelineView } from "#src/entities/timeline/index.ts";
import { useCachedClient } from "#src/features/auth/index.ts";
import Container from "#src/shared/ui/container.tsx";
import ErrorBoundary from "#src/shared/ui/error-boundary.ts";
import LoadingFallback from "#src/shared/ui/loading-fallback.tsx";

export default function SignedInView(): React.ReactElement {
  const client = useCachedClient();

  useEffect(() => {
    client.fetchTimeline();
  }, [client]);

  const feed = useSyncExternalStore(client.subscribe, () => client.state.timelineFeed);

  return (
    <ErrorBoundary fallback={<div>Failed to load</div>}>
      <div className="py-4">
        <Container>{feed ? <TimelineView feed={feed} /> : <LoadingFallback />}</Container>
      </div>
    </ErrorBoundary>
  );
}
