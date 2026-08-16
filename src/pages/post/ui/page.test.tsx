import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Suspense } from "react";
import { MemoryRouter, Route, Routes } from "react-router";
import { expect, test, vi } from "vitest";
import { render } from "vitest-browser-react";

import type { app } from "#src/shared/api/lexicons/index.ts";
import type { Session } from "#src/shared/auth/index.ts";
import { AtProtoMockProvider } from "#src/test/atproto-mock-provider.tsx";
import { createMockSession } from "#src/test/atproto-mock.ts";

import { Page } from "./page.tsx";

type GetPostThreadOutput = app.bsky.feed.getPostThread.$Output["body"];
type ThreadValue = GetPostThreadOutput["thread"];
type ThreadViewPost = Extract<ThreadValue, { $type: "app.bsky.feed.defs#threadViewPost" }>;
type PostView = app.bsky.feed.defs.PostView;

const post: PostView = {
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
    text: "target post",
    createdAt: "2024-01-01T00:00:00.000Z",
  },
  indexedAt: "2024-01-01T00:00:00.000Z",
  replyCount: 0,
  repostCount: 0,
  quoteCount: 0,
  likeCount: 0,
};

function createPost(text: string, id: string): PostView {
  return {
    ...post,
    uri: `at://did:plc:alice/app.bsky.feed.post/${id}`,
    cid: "bafyreib3",
    record: { ...post.record, text },
  };
}

function threadView(overrides: Partial<ThreadViewPost> = {}): GetPostThreadOutput {
  return {
    thread: {
      $type: "app.bsky.feed.defs#threadViewPost",
      post,
      ...overrides,
    } as ThreadViewPost,
  };
}

function mockLexCall(session: Session) {
  return vi.spyOn(session.client, "call");
}

function renderPage(session: Session) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

  return render(
    <QueryClientProvider client={queryClient}>
      <AtProtoMockProvider session={session}>
        <MemoryRouter initialEntries={["/profile/alice.test/post/1"]}>
          <Suspense>
            <Routes>
              <Route path="/profile/:handle/post/:postId" element={<Page />} />
            </Routes>
          </Suspense>
        </MemoryRouter>
      </AtProtoMockProvider>
    </QueryClientProvider>,
  );
}

function notFoundPost() {
  return { $type: "app.bsky.feed.defs#notFoundPost" } as unknown as ThreadValue;
}

function blockedPost() {
  return { $type: "app.bsky.feed.defs#blockedPost" } as unknown as ThreadValue;
}

test("URLパラメータの handle と postId から構築した URI で投稿スレッドを取得する", async () => {
  const session = createMockSession();
  const call = mockLexCall(session);
  call.mockResolvedValue(threadView());

  await renderPage(session);

  expect(call).toHaveBeenCalledWith(expect.anything(), {
    uri: "at://alice.test/app.bsky.feed.post/1",
    depth: void 0,
    parentHeight: void 0,
  });
});

test("投稿スレッドの取得で Error が発生したときはエラーメッセージを表示する", async () => {
  const session = createMockSession();
  mockLexCall(session).mockRejectedValue(new Error("Failed to load post"));

  const view = await renderPage(session);

  await expect.element(view.getByText("Failed to load post", { exact: true })).toBeInTheDocument();
});

test("投稿スレッドの取得で Error 以外の値が発生したときは空のエラー表示になる", async () => {
  const session = createMockSession();
  mockLexCall(session).mockRejectedValue("failed");

  const view = await renderPage(session);

  await expect.element(view.getByText("target post", { exact: true })).not.toBeInTheDocument();
  expect(view.container.textContent).not.toContain("Unknown error");
});

test("通常の投稿スレッドを取得したときは対象の投稿を詳細カードで表示する", async () => {
  const session = createMockSession();
  mockLexCall(session).mockResolvedValue(threadView());

  const view = await renderPage(session);

  await expect.element(view.getByText("target post", { exact: true })).toBeInTheDocument();
  await expect.element(view.getByRole("link", { name: "Alice" })).toBeInTheDocument();
});

test("親投稿がない投稿スレッドを取得したときは親投稿を表示しない", async () => {
  const session = createMockSession();
  mockLexCall(session).mockResolvedValue(threadView({ parent: void 0 }));

  const view = await renderPage(session);

  expect(view.container.textContent).not.toContain("parent post");
  await expect.element(view.getByText("target post", { exact: true })).toBeInTheDocument();
});

test("親投稿がある投稿スレッドを取得したときは対象の投稿より前に親投稿を表示する", async () => {
  const session = createMockSession();
  const parent = createPost("parent post", "2");
  mockLexCall(session).mockResolvedValue(
    threadView({
      parent: { $type: "app.bsky.feed.defs#threadViewPost", post: parent },
    }),
  );

  const view = await renderPage(session);

  await expect.element(view.getByText("parent post", { exact: true })).toBeInTheDocument();
  await expect.element(view.getByText("target post", { exact: true })).toBeInTheDocument();
  const text = view.container.textContent ?? "";
  expect(text.indexOf("parent post")).toBeLessThan(text.indexOf("target post"));
});

test("複数階層の親投稿があるときは古い親投稿から対象の投稿まで順番に表示する", async () => {
  const session = createMockSession();
  const grandparent = createPost("grandparent post", "3");
  const parent = createPost("parent post", "2");
  mockLexCall(session).mockResolvedValue(
    threadView({
      parent: {
        $type: "app.bsky.feed.defs#threadViewPost",
        post: parent,
        parent: { $type: "app.bsky.feed.defs#threadViewPost", post: grandparent },
      },
    }),
  );

  const view = await renderPage(session);
  await expect.element(view.getByText("grandparent post", { exact: true })).toBeInTheDocument();
  await expect.element(view.getByText("parent post", { exact: true })).toBeInTheDocument();
  await expect.element(view.getByText("target post", { exact: true })).toBeInTheDocument();
  const text = view.container.textContent ?? "";

  expect(text.indexOf("grandparent post")).toBeLessThan(text.indexOf("parent post"));
  expect(text.indexOf("parent post")).toBeLessThan(text.indexOf("target post"));
});

test("親投稿が見つからないときは見つからない親投稿の表示を追加しない", async () => {
  const session = createMockSession();
  mockLexCall(session).mockResolvedValue(threadView({ parent: notFoundPost() }));

  const view = await renderPage(session);

  await expect.element(view.getByText("target post", { exact: true })).toBeInTheDocument();
  expect(view.container.textContent).not.toContain("Post not found");
});

test("親投稿がブロックされているときはブロックされた親投稿の表示を追加しない", async () => {
  const session = createMockSession();
  mockLexCall(session).mockResolvedValue(threadView({ parent: blockedPost() }));

  const view = await renderPage(session);

  await expect.element(view.getByText("target post", { exact: true })).toBeInTheDocument();
  expect(view.container.textContent).not.toContain("Post is blocked");
});

test("返信がない投稿スレッドを取得したときは返信一覧を表示しない", async () => {
  const session = createMockSession();
  mockLexCall(session).mockResolvedValue(threadView({ replies: void 0 }));

  const view = await renderPage(session);

  expect(view.container.querySelector("ul")).toBeNull();
});

test("空の返信一覧を取得したときは返信一覧を表示しない", async () => {
  const session = createMockSession();
  mockLexCall(session).mockResolvedValue(threadView({ replies: [] }));

  const view = await renderPage(session);

  expect(view.container.querySelector("ul")).toBeNull();
});

test("複数の返信があるときはすべての返信を一覧表示する", async () => {
  const session = createMockSession();
  const firstReply = createPost("first reply", "2");
  const secondReply = createPost("second reply", "3");
  mockLexCall(session).mockResolvedValue(
    threadView({
      replies: [
        { $type: "app.bsky.feed.defs#threadViewPost", post: firstReply },
        { $type: "app.bsky.feed.defs#threadViewPost", post: secondReply },
      ],
    }),
  );

  const view = await renderPage(session);

  await expect.element(view.getByText("first reply", { exact: true })).toBeInTheDocument();
  await expect.element(view.getByText("second reply", { exact: true })).toBeInTheDocument();
});

test("返信に返信があるときは入れ子の返信を表示する", async () => {
  const session = createMockSession();
  const reply = createPost("reply", "2");
  const nestedReply = createPost("nested reply", "3");
  mockLexCall(session).mockResolvedValue(
    threadView({
      replies: [
        {
          $type: "app.bsky.feed.defs#threadViewPost",
          post: reply,
          replies: [{ $type: "app.bsky.feed.defs#threadViewPost", post: nestedReply }],
        },
      ],
    }),
  );

  const view = await renderPage(session);

  await expect.element(view.getByText("nested reply", { exact: true })).toBeInTheDocument();
});

test("返信が見つからないときは見つからない返信を表示する", async () => {
  const session = createMockSession();
  mockLexCall(session).mockResolvedValue(threadView({ replies: [notFoundPost()] }));

  const view = await renderPage(session);

  await expect.element(view.getByText("Post not found", { exact: true })).toBeInTheDocument();
});

test("返信がブロックされているときはブロックされた返信を表示する", async () => {
  const session = createMockSession();
  mockLexCall(session).mockResolvedValue(threadView({ replies: [blockedPost()] }));

  const view = await renderPage(session);

  await expect.element(view.getByText("Post is blocked", { exact: true })).toBeInTheDocument();
});

test("投稿スレッドの種類が未知のときは Unknown post type を表示する", async () => {
  const session = createMockSession();
  mockLexCall(session).mockResolvedValue({
    thread: { $type: "app.bsky.feed.defs#unknownPost" },
  } as unknown as GetPostThreadOutput);

  const view = await renderPage(session);

  await expect.element(view.getByText("Unknown post type", { exact: true })).toBeInTheDocument();
});

test("親投稿の種類が未知のときは Unknown post type を表示する", async () => {
  const session = createMockSession();
  mockLexCall(session).mockResolvedValue(
    threadView({
      parent: { $type: "app.bsky.feed.defs#unknownParent" } as unknown as ThreadValue,
    }),
  );

  const view = await renderPage(session);

  await expect.element(view.getByText("Unknown post type", { exact: true })).toBeInTheDocument();
});

test("返信の種類が未知のときは Unknown post type を表示する", async () => {
  const session = createMockSession();
  mockLexCall(session).mockResolvedValue(
    threadView({
      replies: [
        { $type: "app.bsky.feed.defs#unknownReply" },
      ] as unknown as ThreadViewPost["replies"],
    }),
  );

  const view = await renderPage(session);

  await expect.element(view.getByText("Unknown post type", { exact: true })).toBeInTheDocument();
});

test("対象の投稿を表示したときは対象投稿へスクロールする", async () => {
  const scrollIntoView = vi
    .spyOn(HTMLElement.prototype, "scrollIntoView")
    .mockImplementation(() => {});
  const session = createMockSession();
  mockLexCall(session).mockResolvedValue(threadView());

  const view = await renderPage(session);
  await expect.element(view.getByText("target post", { exact: true })).toBeInTheDocument();

  expect(scrollIntoView).toHaveBeenCalledOnce();
  scrollIntoView.mockRestore();
});
