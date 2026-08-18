"use client";

import { expect, test, vi } from "vitest";

import type { app } from "#src/shared/api/lexicons/index.ts";
import { createMockSession } from "#src/test/atproto-mock.ts";
import { renderWithProviders } from "#src/test/render-with-providers.tsx";

import { useRepostState } from "./use-repost-state";

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

const repostedPostView: app.bsky.feed.defs.PostView = {
  ...defaultPostView,
  viewer: {
    $type: "app.bsky.feed.defs#viewerState",
    repost: "at://did:plc:alice/app.bsky.feed.repost/repostrkey",
  },
};

function RepostStateTestWrapper({ postView }: { postView: app.bsky.feed.defs.PostView }) {
  const [isReposted, toggleRepost] = useRepostState(postView);

  return (
    <div>
      <span data-testid="repost-status">{isReposted ? "reposted" : "unreposted"}</span>
      <button onClick={toggleRepost}>Toggle Repost</button>
    </div>
  );
}

function renderView(
  postView: app.bsky.feed.defs.PostView = defaultPostView,
  session = createMockSession(),
) {
  return renderWithProviders(<RepostStateTestWrapper postView={postView} />, { session });
}

test("repostしていないとき、toggleRepostを呼ぶと、repostedになる", async () => {
  const session = createMockSession();
  vi.spyOn(session.client, "create").mockResolvedValue({
    uri: "at://did:plc:alice/app.bsky.feed.repost/repostrkey",
  } as never);

  const view = await renderView(defaultPostView, session);

  await expect.element(view.getByText("unreposted", { exact: true })).toBeInTheDocument();

  await view.getByRole("button", { name: "Toggle Repost", exact: true }).click();

  await expect.element(view.getByText("reposted", { exact: true })).toBeInTheDocument();
});

test("repostしていないとき、toggleRepostが失敗すると、unrepostedにもどる", async () => {
  const session = createMockSession();
  vi.spyOn(session.client, "create").mockRejectedValue(new Error("Repost failed"));

  const view = await renderView(defaultPostView, session);

  await expect.element(view.getByText("unreposted", { exact: true })).toBeInTheDocument();

  await view.getByRole("button", { name: "Toggle Repost", exact: true }).click();

  // State should revert to unreposted after error
  await expect.element(view.getByText("unreposted", { exact: true })).toBeInTheDocument();
});

test("repostしていないとき、toggleRepostが成功すると、repostCacheにrepostUriがセットされる", async () => {
  const session = createMockSession();
  const repostUri = "at://did:plc:alice/app.bsky.feed.repost/repostrkey";
  vi.spyOn(session.client, "create").mockResolvedValue({ uri: repostUri } as never);

  const view = await renderView(defaultPostView, session);

  await view.getByRole("button", { name: "Toggle Repost", exact: true }).click();

  await expect.element(view.getByText("reposted", { exact: true })).toBeInTheDocument();

  expect(session.repostCache.get(defaultPostView)).toBe(repostUri);
});

test("repostしているとき、toggleRepostを呼ぶと、unrepostedになる", async () => {
  const session = createMockSession();
  vi.spyOn(session.client, "delete").mockResolvedValue({} as never);

  const view = await renderView(repostedPostView, session);

  await expect.element(view.getByText("reposted", { exact: true })).toBeInTheDocument();

  await view.getByRole("button", { name: "Toggle Repost", exact: true }).click();

  await expect.element(view.getByText("unreposted", { exact: true })).toBeInTheDocument();
});

test("repostしているとき、toggleRepostが失敗すると、repostedにもどる", async () => {
  const session = createMockSession();
  vi.spyOn(session.client, "delete").mockRejectedValue(new Error("Unrepost failed"));

  const view = await renderView(repostedPostView, session);

  await expect.element(view.getByText("reposted", { exact: true })).toBeInTheDocument();

  await view.getByRole("button", { name: "Toggle Repost", exact: true }).click();

  // State should revert to reposted after error
  await expect.element(view.getByText("reposted", { exact: true })).toBeInTheDocument();
});

test("repostしているとき、toggleRepostが成功すると、repostCacheにnullがセットされる", async () => {
  const session = createMockSession();
  vi.spyOn(session.client, "delete").mockResolvedValue({} as never);

  const view = await renderView(repostedPostView, session);

  await view.getByRole("button", { name: "Toggle Repost", exact: true }).click();

  await expect.element(view.getByText("unreposted", { exact: true })).toBeInTheDocument();

  expect(session.repostCache.get(repostedPostView)).toBeNull();
});
