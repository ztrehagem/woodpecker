"use client";

import { expect, test, vi } from "vitest";

import type { app } from "#src/shared/api/lexicons/index.ts";
import { createMockSession } from "#src/test/atproto-mock.ts";
import { renderWithProviders } from "#src/test/render-with-providers.tsx";

import { useBookmark } from "./use-bookmark-state";

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

const savedPostView: app.bsky.feed.defs.PostView = {
  ...defaultPostView,
  viewer: {
    $type: "app.bsky.feed.defs#viewerState",
    bookmarked: true,
  },
};

function BookmarkStateTestWrapper({ postView }: { postView: app.bsky.feed.defs.PostView }) {
  const { isSaved, save, unsave } = useBookmark(postView);

  return (
    <div>
      <span data-testid="bookmark-status">{isSaved ? "saved" : "unsaved"}</span>
      <button onClick={save}>Save</button>
      <button onClick={unsave}>Unsave</button>
    </div>
  );
}

function renderView(
  postView: app.bsky.feed.defs.PostView = defaultPostView,
  session = createMockSession(),
) {
  return renderWithProviders(<BookmarkStateTestWrapper postView={postView} />, { session });
}

test("保存していないとき、saveを呼ぶと、savedになる", async () => {
  const session = createMockSession();
  vi.spyOn(session.client, "call").mockResolvedValue({} as never);

  const view = await renderView(defaultPostView, session);

  await expect.element(view.getByText("unsaved", { exact: true })).toBeInTheDocument();

  await view.getByRole("button", { name: "Save", exact: true }).click();

  await expect.element(view.getByText("saved", { exact: true })).toBeInTheDocument();
});

test("保存していないとき、saveが失敗すると、unsavedのままになる", async () => {
  const session = createMockSession();
  vi.spyOn(session.client, "call").mockRejectedValue(new Error("Save failed"));

  const view = await renderView(defaultPostView, session);

  await expect.element(view.getByText("unsaved", { exact: true })).toBeInTheDocument();

  await view.getByRole("button", { name: "Save", exact: true }).click();

  // State should revert to unsaved after error
  await expect.element(view.getByText("unsaved", { exact: true })).toBeInTheDocument();
});

test("保存していないとき、saveが成功すると、bookmarkCacheにtrueがセットされる", async () => {
  const session = createMockSession();
  vi.spyOn(session.client, "call").mockResolvedValue({} as never);

  const view = await renderView(defaultPostView, session);

  await view.getByRole("button", { name: "Save", exact: true }).click();

  await expect.element(view.getByText("saved", { exact: true })).toBeInTheDocument();

  expect(session.bookmarkCache.get(defaultPostView)).toBe(true);
});

test("保存しているとき、unsaveを呼ぶと、unsavedになる", async () => {
  const session = createMockSession();
  vi.spyOn(session.client, "call").mockResolvedValue({} as never);

  const view = await renderView(savedPostView, session);

  await expect.element(view.getByText("saved", { exact: true })).toBeInTheDocument();

  await view.getByRole("button", { name: "Unsave", exact: true }).click();

  await expect.element(view.getByText("unsaved", { exact: true })).toBeInTheDocument();
});

test("保存しているとき、unsaveが失敗すると、savedにもどる", async () => {
  const session = createMockSession();
  vi.spyOn(session.client, "call").mockRejectedValue(new Error("Unsave failed"));

  const view = await renderView(savedPostView, session);

  await expect.element(view.getByText("saved", { exact: true })).toBeInTheDocument();

  await view.getByRole("button", { name: "Unsave", exact: true }).click();

  // State should revert to saved after error
  await expect.element(view.getByText("saved", { exact: true })).toBeInTheDocument();
});

test("保存しているとき、unsaveが成功すると、bookmarkCacheにfalseがセットされる", async () => {
  const session = createMockSession();
  vi.spyOn(session.client, "call").mockResolvedValue({} as never);

  const view = await renderView(savedPostView, session);

  await view.getByRole("button", { name: "Unsave", exact: true }).click();

  await expect.element(view.getByText("unsaved", { exact: true })).toBeInTheDocument();

  expect(session.bookmarkCache.get(savedPostView)).toBe(false);
});
