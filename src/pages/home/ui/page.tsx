import type React from "react";
import { Suspense, use } from "react";

import { useOAuthClient, useOAuthResult } from "#src/features/auth/index.ts";
import { useCachedClient } from "#src/features/auth/index.ts";
import type { app } from "#src/shared/api/lexicons/index.ts";
import ErrorBoundary from "#src/shared/ui/error-boundary.ts";
import { Header } from "#src/widgets/header/index.ts";

import SignInForm from "./sign-in-form";

export default function Page(): React.ReactElement {
  const oauthResult = useOAuthResult();

  return (
    <div className="flex min-h-dvh flex-col">
      <Header />

      {oauthResult ? <SignedInView /> : <SignedOutView />}
    </div>
  );
}

function SignedOutView(): React.ReactElement {
  const oauthClient = useOAuthClient();

  return (
    <div className="grid grow grid-cols-1 grid-rows-1 place-items-center px-5 py-4">
      <SignInForm
        action={async (params) => {
          await oauthClient.signIn(params.handle, {
            state: "DUMMY_STATE",
          });
        }}
      />
    </div>
  );
}

function SignedInView(): React.ReactElement {
  const client = useCachedClient();

  return (
    <div>
      <ErrorBoundary fallback={<div>Failed to load</div>}>
        <Suspense fallback={<div>Loading...</div>}>
          <ProfileView profilePromise={client.getProfile()} />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}

function ProfileView({
  profilePromise,
}: Readonly<{
  profilePromise: Promise<app.bsky.actor.defs.ProfileViewDetailed>;
}>): React.ReactElement {
  const profile = use(profilePromise);

  return (
    <div>
      <h2>Profile</h2>

      <dl>
        <dt>did</dt>
        <dd>{profile.did}</dd>

        <dt>handle</dt>
        <dd>{profile.handle}</dd>

        <dt>displayName</dt>
        <dd>{profile.displayName}</dd>

        <dt>description</dt>
        <dd className="whitespace-pre-line">{profile.description}</dd>

        <dt>followersCount</dt>
        <dd>{profile.followersCount}</dd>

        <dt>followsCount</dt>
        <dd>{profile.followsCount}</dd>

        <dt>postsCount</dt>
        <dd>{profile.postsCount}</dd>

        <dt>avatar</dt>
        <dd>
          <img src={profile.avatar} alt="avatar" width="200" />
        </dd>

        <dt>banner</dt>
        <dd>
          <img src={profile.banner} alt="banner" width="1200" />
        </dd>
      </dl>
    </div>
  );
}
