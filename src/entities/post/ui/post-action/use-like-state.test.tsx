"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Suspense } from "react";
import { expect, test, vi } from "vitest";
import { render } from "vitest-browser-react";

import type { app } from "#src/shared/api/lexicons/index.ts";
import { AtProtoMockProvider } from "#src/test/atproto-mock-provider.tsx";
import { createMockSession } from "#src/test/atproto-mock.ts";

import { useLikeState } from "./use-like-state";

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

const likedPostView: app.bsky.feed.defs.PostView = {
  ...defaultPostView,
  viewer: {
    $type: "app.bsky.feed.defs#viewerState",
    like: "at://did:plc:alice/app.bsky.feed.like/likekey",
  },
};

function LikeStateTestWrapper({ postView }: { postView: app.bsky.feed.defs.PostView }) {
  const [isLiked, toggleLike] = useLikeState(postView);

  return (
    <div>
      <span data-testid="like-status">{isLiked ? "liked" : "unliked"}</span>
      <button onClick={toggleLike}>Toggle Like</button>
    </div>
  );
}

function renderView(
  postView: app.bsky.feed.defs.PostView = defaultPostView,
  session = createMockSession(),
) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

  return render(
    <QueryClientProvider client={queryClient}>
      <AtProtoMockProvider session={session}>
        <Suspense>
          <LikeStateTestWrapper postView={postView} />
        </Suspense>
      </AtProtoMockProvider>
    </QueryClientProvider>,
  );
}

test("likeしていないとき、toggleLikeを呼ぶと、likedになる", async () => {
  const session = createMockSession();
  vi.spyOn(session.client, "create").mockResolvedValue({
    uri: "at://did:plc:alice/app.bsky.feed.like/likekey",
  } as never);

  const view = await renderView(defaultPostView, session);

  await expect.element(view.getByText("unliked")).toBeInTheDocument();

  await view.getByRole("button", { name: "Toggle Like" }).click();

  await expect.element(view.getByText("liked")).toBeInTheDocument();
});

test("likeしていないとき、toggleLikeが失敗すると、unlikedにもどる", async () => {
  const session = createMockSession();
  vi.spyOn(session.client, "create").mockRejectedValue(new Error("Like failed"));

  const view = await renderView(defaultPostView, session);

  await expect.element(view.getByText("unliked")).toBeInTheDocument();

  await view.getByRole("button", { name: "Toggle Like" }).click();

  // State should revert to unliked after error
  await expect.element(view.getByText("unliked")).toBeInTheDocument();
});

test("likeしていないとき、toggleLikeが成功すると、likeCacheにlikeUriがセットされる", async () => {
  const session = createMockSession();
  const likeUri = "at://did:plc:alice/app.bsky.feed.like/likekey";
  vi.spyOn(session.client, "create").mockResolvedValue({ uri: likeUri } as never);

  const view = await renderView(defaultPostView, session);

  await view.getByRole("button", { name: "Toggle Like" }).click();

  await expect.element(view.getByText("liked")).toBeInTheDocument();

  expect(session.likeCache.get(defaultPostView)).toBe(likeUri);
});

test("likeしているとき、toggleLikeを呼ぶと、unlikedになる", async () => {
  const session = createMockSession();
  vi.spyOn(session.client, "delete").mockResolvedValue({} as never);

  const view = await renderView(likedPostView, session);

  await expect.element(view.getByText("liked")).toBeInTheDocument();

  await view.getByRole("button", { name: "Toggle Like" }).click();

  await expect.element(view.getByText("unliked")).toBeInTheDocument();
});

test("likeしているとき、toggleLikeが失敗すると、likedにもどる", async () => {
  const session = createMockSession();
  vi.spyOn(session.client, "delete").mockRejectedValue(new Error("Unlike failed"));

  const view = await renderView(likedPostView, session);

  await expect.element(view.getByText("liked")).toBeInTheDocument();

  await view.getByRole("button", { name: "Toggle Like" }).click();

  // State should revert to liked after error
  await expect.element(view.getByText("liked")).toBeInTheDocument();
});

test("likeしているとき、toggleLikeが成功すると、likeCacheにnullがセットされる", async () => {
  const session = createMockSession();
  vi.spyOn(session.client, "delete").mockResolvedValue({} as never);

  const view = await renderView(likedPostView, session);

  await view.getByRole("button", { name: "Toggle Like" }).click();

  await expect.element(view.getByText("unliked")).toBeInTheDocument();

  expect(session.likeCache.get(likedPostView)).toBeNull();
});
