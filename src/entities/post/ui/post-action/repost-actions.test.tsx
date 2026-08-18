import { beforeEach, describe, expect, test, vi } from "vitest";
import type { render } from "vitest-browser-react";
import { page } from "vitest/browser";

import { app } from "#src/shared/api/lexicons/index.ts";
import { ToastRenderer } from "#src/shared/ui/toast.tsx";
import { createMockSession } from "#src/test/atproto-mock.ts";
import { renderWithProviders } from "#src/test/render-with-providers.tsx";
import { Viewport } from "#src/test/viewport.ts";

import { NewPostDialog } from "../new-post-dialog/new-post-dialog";
import { RepostActions } from "./repost-actions";

const defaultPostView: app.bsky.feed.defs.PostView = {
  $type: "app.bsky.feed.defs#postView",
  uri: "at://did:plc:alice/app.bsky.feed.post/rkey",
  cid: "bafyreic",
  author: {
    did: "did:plc:alice",
    handle: "alice.bsky.social",
  },
  indexedAt: "2023-01-01T00:00:00.000Z",
  record: {
    $type: "app.bsky.feed.post",
    text: "hello",
    createdAt: "2023-01-01T00:00:00.000Z",
  },
};

const repostedPostView: app.bsky.feed.defs.PostView = {
  ...defaultPostView,
  viewer: {
    repost: "at://did:plc:alice/app.bsky.feed.repost/repostrkey",
  },
};

function renderView({
  session = createMockSession(),
  postView = defaultPostView,
}: {
  session?: ReturnType<typeof createMockSession>;
  postView?: app.bsky.feed.defs.PostView;
} = {}) {
  return renderWithProviders(
    <>
      <RepostActions postView={postView} />
      <NewPostDialog />
      <ToastRenderer />
    </>,
    { session },
  );
}

function openMenu(view: Awaited<ReturnType<typeof render>>) {
  return view.getByRole("button", { name: /Reposts/ }).click();
}

describe.each([
  { style: "Drawer", viewport: Viewport.mobile, itemRole: "button" },
  { style: "Menu", viewport: Viewport.laptop, itemRole: "menuitem" },
] as const)("$style style", ({ viewport, itemRole }) => {
  beforeEach(async () => {
    await page.viewport(viewport[0], viewport[1]);
  });

  test.each([
    { case: "未リポスト", postView: defaultPostView, repostLabel: "Repost" },
    { case: "リポスト済み", postView: repostedPostView, repostLabel: "Undo repost" },
  ])("トリガーを押すと選択肢が表示される ($case)", async ({ postView, repostLabel }) => {
    const view = await renderView({ postView });

    await openMenu(view);

    await expect
      .element(view.getByRole(itemRole, { name: repostLabel, exact: true }))
      .toBeInTheDocument();
    await expect
      .element(view.getByRole(itemRole, { name: "Quote post", exact: true }))
      .toBeInTheDocument();
  });

  test("Repost を選ぶと、リポストレコードが作成される", async () => {
    const session = createMockSession();
    const spy = vi.spyOn(session.client, "create").mockResolvedValue({} as never);
    const view = await renderView({ session });

    await openMenu(view);
    await view.getByRole(itemRole, { name: "Repost", exact: true }).click();

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy.mock.lastCall?.[0]).toBe(app.bsky.feed.repost);
    expect(spy.mock.lastCall?.[1]).toMatchObject({
      subject: { uri: defaultPostView.uri, cid: defaultPostView.cid },
    });
  });

  test("Undo repost を選ぶと、リポストレコードが削除される", async () => {
    const session = createMockSession();
    const spy = vi.spyOn(session.client, "delete").mockResolvedValue({} as never);
    const view = await renderView({ session, postView: repostedPostView });

    await openMenu(view);
    await view.getByRole(itemRole, { name: "Undo repost", exact: true }).click();

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy.mock.lastCall?.[0]).toBe(app.bsky.feed.repost);
    expect(spy.mock.lastCall?.[1]).toMatchObject({ rkey: "repostrkey" });
  });

  test("Quote を選ぶと引用対象をプレビューした投稿ダイアログが開く", async () => {
    const view = await renderView();

    await openMenu(view);
    await view.getByRole(itemRole, { name: "Quote post", exact: true }).click();

    await expect
      .element(view.getByRole("heading", { name: "Quoting post", exact: true }))
      .toBeInTheDocument();
    await expect.element(view.getByText("hello", { exact: true })).toBeInTheDocument();

    // The dialog handle is a module-level singleton, so leave it closed for the next test.
    await view.getByRole("button", { name: "Cancel" }).click();
  });
});
