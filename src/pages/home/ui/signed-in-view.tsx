import React, { Suspense } from "react";

import { useCachedClient } from "#src/features/auth/index.ts";
import Container from "#src/shared/ui/container.tsx";
import ErrorBoundary from "#src/shared/ui/error-boundary.ts";
import { LoadingBoxesIcon } from "#src/shared/ui/icon/index.ts";

import ProfileCard from "./profile-card";

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
        <div className="my-4">
          <Container>
            <ProfileCard.Promise profile={client.getProfile()} />
          </Container>
        </div>
      </Suspense>
    </ErrorBoundary>
  );
}
