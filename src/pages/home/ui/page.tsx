import type React from "react";
import {
  SignInForm,
  SignOutForm,
  useOAuthClient,
  useOAuthResult,
} from "#src/features/auth/index.ts";
import { Suspense, use } from "react";
import type { app } from "#src/shared/api/lexicons/index.ts";
import ErrorBoundary from "#src/shared/ui/error-boundary.ts";
import { useCachedClient } from "#src/features/auth/index.ts";

export default function Page(): React.ReactElement {
  const oauthClient = useOAuthClient();
  const oauthResult = useOAuthResult();

  return (
    <>
      <h1>Woodpecker</h1>

      <hr />

      {oauthResult ? (
        <div>
          <p>
            You are authenticated as <code>{oauthResult.session.sub}</code>
          </p>
          <SignOutForm
            action={async () => {
              await oauthClient.revoke(oauthResult.session.sub);
              location.reload();
            }}
          />

          <hr />

          <ErrorBoundary fallback={<div>Failed to load</div>}>
            <SignedInView />
          </ErrorBoundary>
        </div>
      ) : (
        <SignInForm
          action={async (params) => {
            await oauthClient.signIn(params.handle, {
              state: "DUMMY_STATE",
            });
          }}
        />
      )}
    </>
  );
}

function SignedInView(): React.ReactElement {
  const client = useCachedClient();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProfileView profilePromise={client.getProfile()} />
    </Suspense>
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
        <dd style={{ whiteSpace: "pre-line" }}>{profile.description}</dd>

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
