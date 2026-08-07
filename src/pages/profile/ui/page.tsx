import type { AtIdentifierString } from "@atproto/lex";
import type React from "react";
import { Suspense } from "react";
import { useParams } from "react-router";

import { ProfileCard, useProfileQuery } from "#src/entities/profile/index.ts";
import { useAssertSession } from "#src/shared/auth/index.ts";
import Container from "#src/shared/ui/container.tsx";
import ErrorBoundary from "#src/shared/ui/error-boundary.ts";
import LoadingFallback from "#src/shared/ui/loading-fallback.tsx";
import { Header } from "#src/widgets/header/index.ts";

export default function Page(): React.ReactElement {
  return (
    <div className="flex min-h-dvh flex-col">
      <Header />

      <ErrorBoundary fallback={<div>Failed to load profile.</div>}>
        <Suspense fallback={<LoadingFallback />}>
          <Content />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}

function Content(): React.ReactElement {
  const client = useAssertSession();
  const { handle } = useParams();
  const { data: profile } = useProfileQuery(client, handle as AtIdentifierString);

  return (
    <div className="py-4">
      <Container>{profile ? <ProfileCard profile={profile} /> : <LoadingFallback />}</Container>
    </div>
  );
}
