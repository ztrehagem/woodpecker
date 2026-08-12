import { Suspense } from "react";
import { MemoryRouter } from "react-router";
import { expect, test, vi } from "vitest";
import { render } from "vitest-browser-react";

import type { app } from "#src/shared/api/lexicons/index.ts";
import { AtProtoMockProvider } from "#src/test/atproto-mock-provider.tsx";

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

type MockLikesQueryResult = {
  data: { pages: { feed: app.bsky.feed.defs.FeedViewPost[] }[] } | undefined;
  fetchNextPage: ReturnType<typeof vi.fn<() => Promise<void>>>;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  error: Error | null;
};

let mockLikesQueryResult: MockLikesQueryResult = {
  data: {
    pages: [{ feed: [post] }],
  },
  fetchNextPage: vi.fn<() => Promise<void>>(),
  hasNextPage: false,
  isFetchingNextPage: false,
  error: null,
};

vi.mock("../api/likes-query.ts", () => ({
  useLikesQuery: () => mockLikesQueryResult,
}));

import { Page } from "./page.tsx";

test("いいねが 0 件のときに No likes. を表示する", async () => {
  mockLikesQueryResult = {
    data: {
      pages: [{ feed: [] }],
    },
    fetchNextPage: vi.fn<() => Promise<void>>(),
    hasNextPage: false,
    isFetchingNextPage: false,
    error: null,
  };

  const view = await render(
    <AtProtoMockProvider>
      <MemoryRouter>
        <Suspense>
          <Page />
        </Suspense>
      </MemoryRouter>
    </AtProtoMockProvider>,
  );

  await expect.element(view.getByText("No likes.", { exact: true })).toBeInTheDocument();
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

  mockLikesQueryResult = {
    data: {
      pages: [{ feed: [post] }, { feed: [secondPost] }],
    },
    fetchNextPage: vi.fn<() => Promise<void>>(),
    hasNextPage: false,
    isFetchingNextPage: false,
    error: null,
  };

  const view = await render(
    <AtProtoMockProvider>
      <MemoryRouter>
        <Suspense>
          <Page />
        </Suspense>
      </MemoryRouter>
    </AtProtoMockProvider>,
  );

  await expect.element(view.getByText("liked post", { exact: true })).toBeInTheDocument();
  await expect.element(view.getByText("second liked post", { exact: true })).toBeInTheDocument();
});

test("次のページがあるときに Load more ボタンを表示する", async () => {
  mockLikesQueryResult = {
    data: {
      pages: [{ feed: [post] }],
    },
    fetchNextPage: vi.fn<() => Promise<void>>(),
    hasNextPage: true,
    isFetchingNextPage: false,
    error: null,
  };

  const view = await render(
    <AtProtoMockProvider>
      <MemoryRouter>
        <Suspense>
          <Page />
        </Suspense>
      </MemoryRouter>
    </AtProtoMockProvider>,
  );

  await expect.element(view.getByRole("button", { name: "Load more" })).toBeInTheDocument();
});

test("次のページがないときに Load more ボタンを表示しない", async () => {
  mockLikesQueryResult = {
    data: {
      pages: [{ feed: [post] }],
    },
    fetchNextPage: vi.fn<() => Promise<void>>(),
    hasNextPage: false,
    isFetchingNextPage: false,
    error: null,
  };

  const view = await render(
    <AtProtoMockProvider>
      <MemoryRouter>
        <Suspense>
          <Page />
        </Suspense>
      </MemoryRouter>
    </AtProtoMockProvider>,
  );

  expect(view.container.textContent).not.toContain("Load more");
});

test("次のページ取得中は Load more ボタンが disabled になる", async () => {
  mockLikesQueryResult = {
    data: {
      pages: [{ feed: [post] }],
    },
    fetchNextPage: vi.fn<() => Promise<void>>(),
    hasNextPage: true,
    isFetchingNextPage: true,
    error: null,
  };

  const view = await render(
    <AtProtoMockProvider>
      <MemoryRouter>
        <Suspense>
          <Page />
        </Suspense>
      </MemoryRouter>
    </AtProtoMockProvider>,
  );

  const button = view.getByRole("button", { name: "Load more", includeHidden: true });
  expect(button).not.toBeNull();
  await expect.element(button!).toBeDisabled();
});

test("データ取得中は LoadingFallback を表示する", async () => {
  mockLikesQueryResult = {
    data: void 0,
    fetchNextPage: vi.fn<() => Promise<void>>(),
    hasNextPage: false,
    isFetchingNextPage: false,
    error: null,
  };

  const view = await render(
    <AtProtoMockProvider>
      <MemoryRouter>
        <Suspense>
          <Page />
        </Suspense>
      </MemoryRouter>
    </AtProtoMockProvider>,
  );

  expect(view.container.querySelector("svg")).not.toBeNull();
});

test("Load more ボタンをクリックすると次のページ取得が実行される", async () => {
  const fetchNextPage = vi.fn<() => Promise<void>>();
  mockLikesQueryResult = {
    data: {
      pages: [{ feed: [post] }],
    },
    fetchNextPage,
    hasNextPage: true,
    isFetchingNextPage: false,
    error: null,
  };

  const view = await render(
    <AtProtoMockProvider>
      <MemoryRouter>
        <Suspense>
          <Page />
        </Suspense>
      </MemoryRouter>
    </AtProtoMockProvider>,
  );

  await view.getByRole("button", { name: "Load more" }).click();

  expect(fetchNextPage).toHaveBeenCalledTimes(1);
});

test("いいねした投稿が表示される", async () => {
  mockLikesQueryResult = {
    data: {
      pages: [{ feed: [post] }],
    },
    fetchNextPage: vi.fn<() => Promise<void>>(),
    hasNextPage: false,
    isFetchingNextPage: false,
    error: null,
  };

  const view = await render(
    <AtProtoMockProvider>
      <MemoryRouter>
        <Suspense>
          <Page />
        </Suspense>
      </MemoryRouter>
    </AtProtoMockProvider>,
  );

  await expect.element(view.getByText("liked post", { exact: true })).toBeInTheDocument();
});

test("dataがないときでもerrorを表示する", async () => {
  mockLikesQueryResult = {
    data: void 0,
    fetchNextPage: vi.fn<() => Promise<void>>(),
    hasNextPage: false,
    isFetchingNextPage: false,
    error: new Error("Failed to load likes"),
  };

  const view = await render(
    <AtProtoMockProvider>
      <MemoryRouter>
        <Suspense>
          <Page />
        </Suspense>
      </MemoryRouter>
    </AtProtoMockProvider>,
  );

  await expect.element(view.getByText("Failed to load likes", { exact: true })).toBeInTheDocument();
});
