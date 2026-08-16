import { Toast } from "@base-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Suspense } from "react";
import { MemoryRouter } from "react-router";
import { expect, test, vi, type Mock } from "vitest";
import { render } from "vitest-browser-react";

import type { app } from "#src/shared/api/lexicons/index.ts";
import type { Session } from "#src/shared/auth/index.ts";
import { AtProtoMockProvider } from "#src/test/atproto-mock-provider.tsx";
import { createMockSession } from "#src/test/atproto-mock.ts";

import { Page } from "./page.tsx";

type GetActorLikesOutput = { feed: app.bsky.feed.defs.FeedViewPost[]; cursor?: string };

const post: app.bsky.feed.defs.FeedViewPost = {
  post: {
    uri: "at://did:plc:alice/app.bsky.feed.post/1",
    cid: "bafyreib3",
    author: {
      did: "did:plc:alice",
      handle: "alice.test",
      displayName: "Alice",
      avatar: void 0,
    },
    record: {
      $type: "app.bsky.feed.post",
      text: "liked post",
      createdAt: "2024-01-01T00:00:00.000Z",
    },
    indexedAt: "2024-01-01T00:00:00.000Z",
    likeCount: 1,
    replyCount: 0,
    repostCount: 0,
    quoteCount: 0,
    bookmarkCount: 0,
  },
};

// session.client.call is overloaded; spy is cast to the shape actually used by useLikesQuery
function mockLexCall(session: Session): Mock<() => Promise<GetActorLikesOutput>> {
  return vi.spyOn(session.client, "call") as unknown as Mock<() => Promise<GetActorLikesOutput>>;
}

function renderPage(session: Session) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

  return render(
    <QueryClientProvider client={queryClient}>
      <Toast.Provider>
        <AtProtoMockProvider session={session}>
          <MemoryRouter>
            <Suspense>
              <Page />
            </Suspense>
          </MemoryRouter>
        </AtProtoMockProvider>
      </Toast.Provider>
    </QueryClientProvider>,
  );
}

test("いいねが 0 件のときに No likes. を表示する", async () => {
  const session = createMockSession();
  mockLexCall(session).mockResolvedValue({ feed: [] });

  const view = await renderPage(session);

  await expect.element(view.getByText("No likes.", { exact: true })).toBeInTheDocument();
});

test("いいねした投稿が表示される", async () => {
  const session = createMockSession();
  mockLexCall(session).mockResolvedValue({ feed: [post] });

  const view = await renderPage(session);

  await expect.element(view.getByText("liked post", { exact: true })).toBeInTheDocument();
});

test("複数ページのいいねを 1 つの一覧として表示する", async () => {
  const secondPost: app.bsky.feed.defs.FeedViewPost = {
    ...post,
    post: {
      ...post.post,
      uri: "at://did:plc:alice/app.bsky.feed.post/2",
      cid: "bafyreib4",
      record: {
        ...post.post.record,
        text: "second liked post",
      },
    },
  };

  const session = createMockSession();
  mockLexCall(session)
    .mockResolvedValueOnce({ feed: [post], cursor: "cursor1" })
    .mockResolvedValueOnce({ feed: [secondPost] });

  const view = await renderPage(session);

  await expect.element(view.getByText("liked post", { exact: true })).toBeInTheDocument();
  await view.getByRole("button", { name: "Load more" }).click();
  await expect.element(view.getByText("liked post", { exact: true })).toBeInTheDocument();
  await expect.element(view.getByText("second liked post", { exact: true })).toBeInTheDocument();
});

test("次のページがあるときに Load more ボタンを表示する", async () => {
  const session = createMockSession();
  mockLexCall(session).mockResolvedValue({ feed: [post], cursor: "cursor1" });

  const view = await renderPage(session);

  await expect.element(view.getByRole("button", { name: "Load more" })).toBeInTheDocument();
});

test("次のページがないときに Load more ボタンを表示しない", async () => {
  const session = createMockSession();
  mockLexCall(session).mockResolvedValue({ feed: [post] });

  const view = await renderPage(session);

  await expect.element(view.getByText("liked post", { exact: true })).toBeInTheDocument();
  expect(view.container.textContent).not.toContain("Load more");
});

test("次のページ取得中は Load more ボタンが disabled になる", async () => {
  const session = createMockSession();
  mockLexCall(session)
    .mockResolvedValueOnce({ feed: [post], cursor: "cursor1" })
    .mockReturnValueOnce(new Promise(() => {}));

  const view = await renderPage(session);

  await view.getByRole("button", { name: "Load more" }).click();

  const button = view.getByRole("button", { name: "Load more", includeHidden: true });
  await expect.element(button).toBeDisabled();
});

test("Load more ボタンをクリックすると次のページ取得が実行される", async () => {
  const session = createMockSession();
  const call = mockLexCall(session);
  call
    .mockResolvedValueOnce({ feed: [post], cursor: "cursor1" })
    .mockResolvedValueOnce({ feed: [post] });

  const view = await renderPage(session);

  await view.getByRole("button", { name: "Load more" }).click();

  await expect.poll(() => call.mock.calls.length).toBe(2);
});

test("データ取得中は LoadingFallback を表示する", async () => {
  const session = createMockSession();
  mockLexCall(session).mockReturnValue(new Promise(() => {}));

  const view = await renderPage(session);

  await expect.element(view.getByRole("img", { includeHidden: true })).toBeInTheDocument();
});

test("dataがないときでもerrorを表示する", async () => {
  const session = createMockSession();
  mockLexCall(session).mockRejectedValue(new Error("Failed to load likes"));

  const view = await renderPage(session);

  await expect.element(view.getByText("Failed to load likes", { exact: true })).toBeInTheDocument();
});
