import React, { Suspense } from "react";

import { ProfileCard } from "#src/entities/profile/index.ts";
import { TimelineView } from "#src/entities/timeline/index.ts";
import { useCachedClient } from "#src/features/auth/index.ts";
import Container from "#src/shared/ui/container.tsx";
import ErrorBoundary from "#src/shared/ui/error-boundary.ts";
import { LoadingBoxesIcon } from "#src/shared/ui/icon/index.ts";

export default function SignedInView(): React.ReactElement {
  const client = useCachedClient();

  return (
    <ErrorBoundary fallback={<div>Failed to load</div>}>
      <Suspense
        fallback={
          <div className="grid grow grid-cols-1 grid-rows-1 place-items-center px-5 py-4">
            <LoadingBoxesIcon />
          </div>
        }
      >
        <div className="py-4">
          <Container>
            <ProfileCard.Promise profile={client.getProfile()} />
          </Container>
        </div>

        <div className="py-4">
          <Container>
            <h2 className="mb-4 text-2xl font-bold">Timeline</h2>
            <TimelineView.Promise timeline={client.getTimeline()} />
          </Container>
        </div>
      </Suspense>
    </ErrorBoundary>
  );
}
