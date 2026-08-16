import { expect, test, vi, type Mock } from "vitest";

import type { app } from "#src/shared/api/lexicons/index.ts";
import type { Session } from "#src/shared/auth/index.ts";
import { createMockSession } from "#src/test/atproto-mock.ts";
import { renderWithProviders } from "#src/test/render-with-providers.tsx";

import { Page } from "./page.tsx";

type GetBookmarksOutput = app.bsky.bookmark.getBookmarks.$OutputBody;

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
      text: "bookmarked post",
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

const bookmark = {
  item: { ...post.post, $type: "app.bsky.feed.defs#postView" },
  subject: {
    uri: "at://did:plc:alice/app.bsky.feed.post/1",
    cid: "bafyreib3",
  },
  createdAt: "2024-01-01T00:00:00.000Z",
} as app.bsky.bookmark.defs.BookmarkView;

function mockLexCall(session: Session): Mock<() => Promise<GetBookmarksOutput>> {
  return vi.spyOn(session.client, "call") as unknown as Mock<() => Promise<GetBookmarksOutput>>;
}

function renderPage(session: Session) {
  return renderWithProviders(<Page />, { session, initialEntries: ["/"] });
}

test("ブックマークが 0 件のときに No bookmarks. を表示する", async () => {
  const session = createMockSession();
  mockLexCall(session).mockResolvedValue({ bookmarks: [] });

  const view = await renderPage(session);

  await expect.element(view.getByText("No bookmarks.", { exact: true })).toBeInTheDocument();
});

test("ブックマークした投稿が表示される", async () => {
  const session = createMockSession();
  mockLexCall(session).mockResolvedValue({ bookmarks: [bookmark] });

  const view = await renderPage(session);

  await expect.element(view.getByText("bookmarked post", { exact: true })).toBeInTheDocument();
});

test("次のページがあるときに Load more ボタンを表示する", async () => {
  const session = createMockSession();
  mockLexCall(session).mockResolvedValue({ bookmarks: [bookmark], cursor: "cursor1" });

  const view = await renderPage(session);

  await expect.element(view.getByRole("button", { name: "Load more" })).toBeInTheDocument();
});
