import { expect, test } from "vitest";

import type { app } from "#src/shared/api/lexicons/index.ts";
import { renderWithProviders } from "#src/test/render-with-providers.tsx";

import { ProfileCard } from "./profile-card.tsx";

function createProfile(
  overrides: Partial<app.bsky.actor.defs.ProfileViewDetailed> = {},
): app.bsky.actor.defs.ProfileViewDetailed {
  return {
    did: "did:plc:alice",
    handle: "alice.test",
    displayName: "Alice",
    description: "hello world",
    avatar: "https://example.com/avatar.png",
    banner: "https://example.com/banner.png",
    postsCount: 12,
    followsCount: 34,
    followersCount: 56,
    ...overrides,
  } as app.bsky.actor.defs.ProfileViewDetailed;
}

function renderProfile(profile: app.bsky.actor.defs.ProfileViewDetailed) {
  return renderWithProviders(<ProfileCard profile={profile} />, { initialEntries: ["/"] });
}

test("バナー画像が表示される", async () => {
  const profile = createProfile();
  const view = await renderProfile(profile);

  const banner = view.getByRole("img", { name: "banner" });
  await expect.element(banner).toBeInTheDocument();
  await expect.element(banner).toHaveAttribute("src", profile.banner ?? "");
});

test("バナー画像がない場合はフォールバック背景色が表示される", async () => {
  const profile = createProfile({ banner: void 0 });
  const view = await renderProfile(profile);

  await expect.element(view.getByRole("img", { name: "banner" })).not.toBeInTheDocument();
});

test("アバター画像が表示される", async () => {
  const profile = createProfile();
  const view = await renderProfile(profile);

  const avatar = view.getByRole("img", { name: "avatar" });
  await expect.element(avatar).toBeInTheDocument();
  await expect.element(avatar).toHaveAttribute("src", profile.avatar ?? "");
});

test("アバター画像がない場合はフォールバックアイコンが表示される", async () => {
  const profile = createProfile({ avatar: void 0, banner: void 0 });
  const view = await renderProfile(profile);

  await expect.element(view.getByRole("img", { name: "avatar" })).not.toBeInTheDocument();
});

test("名前が表示される", async () => {
  const profile = createProfile({ displayName: "Alice Johnson" });
  const view = await renderProfile(profile);

  await expect.element(view.getByRole("heading", { name: "Alice Johnson" })).toBeInTheDocument();
});

test("名前がない場合はハンドルにフォールバックされる", async () => {
  const profile = createProfile({ displayName: void 0 });
  const view = await renderProfile(profile);

  await expect.element(view.getByRole("heading", { name: profile.handle })).toBeInTheDocument();
});

test("ハンドルが表示される", async () => {
  const profile = createProfile();
  const view = await renderProfile(profile);

  await expect.element(view.getByText(`@${profile.handle}`)).toBeInTheDocument();
});

test("ハンドルにオンマウスするとDIDのツールチップが表示される", async () => {
  const profile = createProfile();
  const view = await renderProfile(profile);

  const handle = view.getByText(`@${profile.handle}`);
  await handle.hover();

  await expect.element(view.getByText(profile.did)).toBeInTheDocument();
});

test("自己紹介文が表示される", async () => {
  const profile = createProfile({ description: "プロフィール本文です" });
  const view = await renderProfile(profile);

  await expect.element(view.getByText("プロフィール本文です")).toBeInTheDocument();
});

test("自己紹介文がない場合は何も表示されない", async () => {
  const profile = createProfile({ description: "" });
  await renderProfile(profile);

  expect(document.body.textContent).not.toContain("hello world");
  expect(document.body.textContent).not.toContain("プロフィール本文です");
});

test("自己紹介文にリッチテキストが含まれる場合は正しく表示される", async () => {
  const url = "https://example.com/about";
  const mention = "@bob.test";
  const profile = createProfile({ description: `詳しくは ${url} と ${mention} を見てください` });
  const view = await renderProfile(profile);

  const urlLink = view.getByRole("link", { name: url });
  await expect.element(urlLink).toBeInTheDocument();
  await expect.element(urlLink).toHaveAttribute("href", url);

  const mentionLink = view.getByRole("link", { name: mention });
  await expect.element(mentionLink).toBeInTheDocument();
  await expect.element(mentionLink).toHaveAttribute("href", "/profile/bob.test");
});

test("投稿数が表示される", async () => {
  const profile = createProfile({ postsCount: 123 });
  const view = await renderProfile(profile);

  await expect.element(view.getByText("123")).toBeInTheDocument();
  await expect.element(view.getByText("Posts")).toBeInTheDocument();
});

test("フォロー数が表示される", async () => {
  const profile = createProfile({ followsCount: 456 });
  const view = await renderProfile(profile);

  await expect.element(view.getByText("456")).toBeInTheDocument();
  await expect.element(view.getByText("Following")).toBeInTheDocument();
});

test("フォロワー数が表示される", async () => {
  const profile = createProfile({ followersCount: 789 });
  const view = await renderProfile(profile);

  await expect.element(view.getByText("789")).toBeInTheDocument();
  await expect.element(view.getByText("Followers")).toBeInTheDocument();
});

test("フォローボタンが表示される", async () => {
  const profile = createProfile();
  const view = await renderProfile(profile);

  await expect.element(view.getByRole("button", { name: "Follow" })).toBeInTheDocument();
});
