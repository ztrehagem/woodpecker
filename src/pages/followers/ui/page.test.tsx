import { Route, Routes } from "react-router";
import { expect, test, vi } from "vitest";

import { app } from "#src/shared/api/lexicons/index.ts";
import type { Session } from "#src/shared/auth/index.ts";
import { createMockSession } from "#src/test/atproto-mock.ts";
import { renderWithProviders } from "#src/test/render-with-providers.tsx";

import { Page } from "./page.tsx";

type Profile = app.bsky.actor.defs.ProfileView;
type Output = app.bsky.graph.getFollowers.$OutputBody;

const subject = {
  did: "did:plc:alice",
  handle: "alice.test",
  displayName: "Alice",
} as Profile;
const follower = { did: "did:plc:bob", handle: "bob.test", displayName: "Bob" } as Profile;
const profile = { ...subject, followersCount: 56 } as app.bsky.actor.defs.ProfileViewDetailed;

function response(followers: Profile[] = [], cursor?: string): Output {
  return { subject, followers, cursor };
}

function renderPage(session: Session) {
  return renderWithProviders(
    <Routes>
      <Route path="/profile/:handle/followers" element={<Page />} />
    </Routes>,
    { session, initialEntries: ["/profile/alice.test/followers"] },
  );
}

function mockCalls(session: Session, followers: Profile[] = [], cursor?: string) {
  return vi.spyOn(session.client, "call").mockImplementation((method) => {
    if (method === app.bsky.actor.getProfile) {
      return Promise.resolve(profile);
    }
    return Promise.resolve(response(followers, cursor));
  });
}

test("URL パラメータの actor でフォロワー一覧を取得する", async () => {
  const session = createMockSession();
  const call = mockCalls(session);

  await renderPage(session);

  await expect
    .poll(() => call)
    .toHaveBeenCalledWith(app.bsky.graph.getFollowers, {
      actor: "alice.test",
      limit: 50,
      cursor: void 0,
    });
});

test("フォロワーがいないときに No followers. を表示する", async () => {
  const session = createMockSession();
  mockCalls(session);

  const view = await renderPage(session);

  await expect.element(view.getByText("No followers.", { exact: true })).toBeInTheDocument();
});

test("対象ユーザー名とフォロワー数を表示する", async () => {
  const session = createMockSession();
  mockCalls(session);

  const view = await renderPage(session);

  await expect.element(view.getByRole("heading", { name: "Alice" })).toBeInTheDocument();
  await expect.element(view.getByText("56 followers", { exact: true })).toBeInTheDocument();
});

test("フォロワー一覧を表示し、Load more で次のページを取得する", async () => {
  const session = createMockSession();
  const secondFollower = {
    ...follower,
    did: "did:plc:carol",
    handle: "carol.test",
    displayName: "Carol",
  } as Profile;
  const call = vi
    .spyOn(session.client, "call")
    .mockImplementation((method, parameters: { cursor?: string }) => {
      if (method === app.bsky.actor.getProfile) {
        return Promise.resolve(profile);
      }
      return Promise.resolve(
        parameters.cursor == null ? response([follower], "cursor1") : response([secondFollower]),
      );
    });

  const view = await renderPage(session);

  await expect.element(view.getByText("Bob", { exact: true })).toBeInTheDocument();
  await view.getByRole("button", { name: "Load more" }).click();
  await expect.element(view.getByText("Carol", { exact: true })).toBeInTheDocument();
  await expect.poll(() => call.mock.calls.length).toBe(3);
});
