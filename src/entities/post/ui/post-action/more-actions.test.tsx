import { beforeEach, describe, expect, test, vi } from "vitest";
import type { render } from "vitest-browser-react";
import { page } from "vitest/browser";

import { app } from "#src/shared/api/lexicons/index.ts";
import { createMockSession } from "#src/test/atproto-mock.ts";
import { renderWithProviders } from "#src/test/render-with-providers.tsx";
import { Viewport } from "#src/test/viewport.ts";

import { MoreActions } from "./more-actions";

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
  },
};

const bookmarkedPostView: app.bsky.feed.defs.PostView = {
  ...defaultPostView,
  viewer: {
    $type: "app.bsky.feed.defs#viewerState",
    bookmarked: true,
  },
};

function renderView({
  postView = defaultPostView,
  session = createMockSession(),
}: {
  postView?: app.bsky.feed.defs.PostView;
  session?: Awaited<ReturnType<typeof createMockSession>>;
} = {}) {
  return renderWithProviders(<MoreActions postView={postView} />, {
    session,
    initialEntries: ["/"],
  });
}

function openMenu(view: Awaited<ReturnType<typeof render>>) {
  return view.getByRole("button").click();
}

describe.each([
  { style: "Drawer", viewport: Viewport.mobile, menuRole: "dialog", itemRole: "button" },
  { style: "Menu", viewport: Viewport.laptop, menuRole: "menu", itemRole: "menuitem" },
] as const)("$style style", ({ viewport, menuRole, itemRole }) => {
  beforeEach(async () => {
    await page.viewport(viewport[0], viewport[1]);
  });

  test("トリガーを押すとメニューが開く", async () => {
    const view = await renderView();

    await openMenu(view);

    await expect.element(view.getByRole(menuRole)).toBeInTheDocument();
  });

  test("ブックマークボタンが表示される", async () => {
    const view = await renderView();

    await openMenu(view);

    await expect.element(view.getByRole(itemRole, { name: "Save" })).toBeInTheDocument();
  });

  test("ブックマークボタンを押すと、ブックマークに追加される", async () => {
    const session = createMockSession();
    const spy = vi.spyOn(session.client, "call").mockResolvedValue({} as never);
    const view = await renderView({ session });

    await openMenu(view);

    const saveButton = view.getByRole(itemRole, { name: "Save" });
    await saveButton.click();

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy.mock.lastCall?.[0]).toBe(app.bsky.bookmark.createBookmark);
    expect(spy.mock.lastCall?.[1]).toEqual({
      uri: defaultPostView.uri,
      cid: defaultPostView.cid,
    });
  });

  test("ブックマークボタンを押すと、ブックマークから削除される", async () => {
    const session = createMockSession();
    const spy = vi.spyOn(session.client, "call").mockResolvedValue({} as never);
    const view = await renderView({ session, postView: bookmarkedPostView });

    await openMenu(view);

    await view.getByRole(itemRole, { name: "Saved" }).click();

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy.mock.lastCall?.[0]).toBe(app.bsky.bookmark.deleteBookmark);
    expect(spy.mock.lastCall?.[1]).toEqual({ uri: defaultPostView.uri });
  });

  test("自分のポストの場合、削除ボタンが表示される", async () => {
    const session = createMockSession("did:plc:alice");
    const view = await renderView({ session });

    await openMenu(view);

    const deleteButton = view.getByRole(itemRole, { name: "Delete" });
    await expect.element(deleteButton).toBeInTheDocument();
  });

  test("自分のポストでない場合、削除ボタンは表示されない", async () => {
    const session = createMockSession("did:plc:bob");
    const view = await renderView({ session });

    await openMenu(view);

    const deleteButton = view.getByRole(itemRole, { name: "Delete" });
    await expect.element(deleteButton).not.toBeInTheDocument();
  });

  test("削除ボタンを押すと、確認ダイアログが表示される", async () => {
    const session = createMockSession("did:plc:alice");
    const view = await renderView({ session });

    await openMenu(view);

    const deleteButton = view.getByRole(itemRole, { name: "Delete" });
    await deleteButton.click();

    await expect.element(view.getByRole("heading", { name: "Delete Post" })).toBeInTheDocument();
  });

  test("削除確認ダイアログでキャンセルを押すと、何も起きない", async () => {
    const session = createMockSession("did:plc:alice");
    const spy = vi.spyOn(session.client, "delete").mockResolvedValue({} as never);
    const view = await renderView({ session });

    await openMenu(view);
    const deleteButton = view.getByRole(itemRole, { name: "Delete" });
    await deleteButton.click();
    await expect.element(view.getByRole("heading", { name: "Delete Post" })).toBeInTheDocument();

    const cancelButton = view.getByRole("button", { name: "Cancel" });
    await cancelButton.click();

    await expect
      .element(view.getByRole("heading", { name: "Delete Post" }))
      .not.toBeInTheDocument();
    expect(spy).not.toHaveBeenCalled();
  });

  test("削除確認ダイアログで削除を押すと、ポストが削除される", async () => {
    const session = createMockSession("did:plc:alice");
    const spy = vi.spyOn(session.client, "delete").mockResolvedValue({} as never);
    const view = await renderView({ session });

    await openMenu(view);
    const deleteButton = view.getByRole(itemRole, { name: "Delete" });
    await deleteButton.click();
    await expect.element(view.getByRole("heading", { name: "Delete Post" })).toBeInTheDocument();

    const confirmButton = view.getByRole("button", { name: "Delete" });
    await confirmButton.click();

    await expect
      .element(view.getByRole("heading", { name: "Delete Post" }))
      .not.toBeInTheDocument();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy.mock.lastCall?.[0]).toBe(app.bsky.feed.post);
  });
});
