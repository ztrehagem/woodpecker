import { expect, test, vi } from "vitest";

import type { app } from "#src/shared/api/lexicons/index.ts";
import { createMockSession } from "#src/test/atproto-mock.ts";
import { renderWithProviders } from "#src/test/render-with-providers.tsx";

import { FollowProfileButton } from "./follow-profile-button.tsx";

const profile = {
  did: "did:plc:alice",
  handle: "alice.test",
} as app.bsky.actor.defs.ProfileView;

function renderButton(
  profileView: app.bsky.actor.defs.ProfileView = profile,
  session = createMockSession(),
) {
  return renderWithProviders(<FollowProfileButton profile={profileView} />, { session });
}

test("フォローしていない場合は Follow が表示される", async () => {
  const view = await renderButton();

  await expect
    .element(view.getByRole("button", { name: "Follow", exact: true }))
    .toBeInTheDocument();
});

test("自分をフォローしている相手には Follow back が表示される", async () => {
  const view = await renderButton({
    ...profile,
    viewer: { followedBy: "at://did:plc:alice/app.bsky.graph.follow/rkey" },
  });

  await expect
    .element(view.getByRole("button", { name: "Follow back", exact: true }))
    .toBeInTheDocument();
});

test("自分のプロフィールではフォローボタンが表示されない", async () => {
  const session = createMockSession();
  const view = await renderButton({ ...profile, did: session.did }, session);

  await expect.element(view.getByRole("button")).not.toBeInTheDocument();
});

test("Follow を押すとフォローレコードが作成される", async () => {
  const session = createMockSession();
  const createSpy = vi.spyOn(session.client, "create").mockResolvedValue({
    uri: "at://did:plc:me/app.bsky.graph.follow/rkey",
  } as never);
  const view = await renderButton(profile, session);

  await view.getByRole("button", { name: "Follow", exact: true }).click();

  expect(createSpy).toHaveBeenCalledTimes(1);
  expect(createSpy.mock.lastCall?.[1]).toMatchObject({ subject: profile.did });
  await expect
    .element(view.getByRole("button", { name: "Following", exact: true }))
    .toBeInTheDocument();
});

test("Following を押すとフォローレコードが削除される", async () => {
  const session = createMockSession();
  const deleteSpy = vi.spyOn(session.client, "delete").mockResolvedValue({} as never);
  const view = await renderButton(
    { ...profile, viewer: { following: "at://did:plc:me/app.bsky.graph.follow/rkey" } },
    session,
  );

  await view.getByRole("button", { name: "Following", exact: true }).click();

  expect(deleteSpy).toHaveBeenCalledTimes(1);
  expect(deleteSpy.mock.lastCall?.[1]).toMatchObject({ rkey: "rkey" });
  await expect
    .element(view.getByRole("button", { name: "Follow", exact: true }))
    .toBeInTheDocument();
});
