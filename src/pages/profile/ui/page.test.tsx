import { Route, Routes } from "react-router";
import { expect, test, vi } from "vitest";

import { app } from "#src/shared/api/lexicons/index.ts";
import type { Session } from "#src/shared/auth/index.ts";
import { createMockSession } from "#src/test/atproto-mock.ts";
import { renderWithProviders } from "#src/test/render-with-providers.tsx";

import { Page } from "./page.tsx";

type ProfileViewDetailed = app.bsky.actor.defs.ProfileViewDetailed;
type FeedViewPost = app.bsky.feed.defs.FeedViewPost;
type GetAuthorFeedOutput = app.bsky.feed.getAuthorFeed.$Output["body"];
type PostThreadOutput = app.bsky.feed.getPostThread.$Output["body"];

function createProfile(overrides: Partial<ProfileViewDetailed> = {}): ProfileViewDetailed {
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
  };
}

function createFeedPost(text: string, id: string): FeedViewPost {
  return {
    post: {
      uri: `at://did:plc:alice/app.bsky.feed.post/${id}`,
      cid: `bafy${id}`,
      author: {
        did: "did:plc:alice",
        handle: "alice.test",
        displayName: "Alice",
        avatar: void 0,
      },
      record: {
        $type: "app.bsky.feed.post",
        text,
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
}

function createAuthorFeedPage(feed: FeedViewPost[] = [], cursor?: string): GetAuthorFeedOutput {
  return {
    feed,
    cursor,
  };
}

function createThreadResponse(post: app.bsky.feed.defs.PostView): PostThreadOutput {
  return {
    thread: {
      $type: "app.bsky.feed.defs#threadViewPost",
      post,
    },
  };
}

function renderPage(session: Session) {
  return renderWithProviders(
    <Routes>
      <Route path="/profile/:handle" element={<Page />} />
    </Routes>,
    { session, initialEntries: ["/profile/alice.test"] },
  );
}

test("プロフィール取得中は ProfileCardSkeleton が表示される", async () => {
  const session = createMockSession();
  const call = vi.spyOn(session.client, "call");

  call.mockImplementation((lexicon) => {
    if (lexicon === app.bsky.actor.getProfile) {
      return new Promise(() => {});
    }
    return Promise.resolve(createAuthorFeedPage([]));
  });

  const view = await renderPage(session);

  expect(view.container.querySelector('section[aria-hidden="true"]')).not.toBeNull();
});

test("プロフィール取得に失敗したときにエラーメッセージが表示される", async () => {
  const session = createMockSession();
  const call = vi.spyOn(session.client, "call");

  call.mockImplementation((lexicon) => {
    if (lexicon === app.bsky.actor.getProfile) {
      return Promise.reject(new Error("Failed to load profile"));
    }
    return Promise.resolve(createAuthorFeedPage([]));
  });

  const view = await renderPage(session);

  await expect
    .element(view.getByText("Failed to load profile", { exact: true }))
    .toBeInTheDocument();
});

test("プロフィールが取得できたときに ProfileCard が表示される", async () => {
  const session = createMockSession();
  const call = vi.spyOn(session.client, "call");
  const profile = createProfile();

  call.mockImplementation((lexicon) => {
    if (lexicon === app.bsky.actor.getProfile) {
      return Promise.resolve(profile);
    }
    return Promise.resolve(createAuthorFeedPage([]));
  });

  const view = await renderPage(session);

  await expect.element(view.getByRole("heading", { name: "Alice" })).toBeInTheDocument();
  await expect.element(view.getByText("@alice.test")).toBeInTheDocument();
});

test("プロフィールに pinnedPost があるときに固定投稿カードが表示される", async () => {
  const session = createMockSession();
  const call = vi.spyOn(session.client, "call");
  const pinnedPost = createFeedPost("pinned post", "1").post;
  const profile = createProfile({
    pinnedPost: {
      uri: pinnedPost.uri,
      cid: pinnedPost.cid,
    },
  });

  call.mockImplementation((method) => {
    if (method === app.bsky.actor.getProfile) {
      return Promise.resolve(profile);
    }
    if (method === app.bsky.feed.getPostThread) {
      return Promise.resolve(createThreadResponse(pinnedPost));
    }
    return Promise.resolve(createAuthorFeedPage([]));
  });

  const view = await renderPage(session);

  await expect.element(view.getByText("pinned post", { exact: true })).toBeInTheDocument();
});

test("投稿一覧が空のときに No posts. が表示される", async () => {
  const session = createMockSession();
  const call = vi.spyOn(session.client, "call");

  call.mockImplementation((method) => {
    if (method === app.bsky.actor.getProfile) {
      return Promise.resolve(createProfile());
    }
    return Promise.resolve(createAuthorFeedPage([]));
  });

  const view = await renderPage(session);

  await expect.element(view.getByText("No posts.", { exact: true })).toBeInTheDocument();
});

test("投稿一覧取得に失敗したときにエラーメッセージが表示される", async () => {
  const session = createMockSession();
  const call = vi.spyOn(session.client, "call");

  call.mockImplementation((method) => {
    if (method === app.bsky.actor.getProfile) {
      return Promise.resolve(createProfile());
    }
    if (method === app.bsky.feed.getAuthorFeed) {
      return Promise.reject(new Error("Failed to load posts"));
    }
    return Promise.resolve(createAuthorFeedPage([]));
  });

  const view = await renderPage(session);

  await expect.element(view.getByText("Failed to load posts", { exact: true })).toBeInTheDocument();
});

test("次のページがあるときに Load more ボタンが表示される", async () => {
  const session = createMockSession();
  const call = vi.spyOn(session.client, "call");

  call.mockImplementation((method) => {
    if (method === app.bsky.actor.getProfile) {
      return Promise.resolve(createProfile());
    }
    return Promise.resolve(createAuthorFeedPage([createFeedPost("first post", "1")], "cursor1"));
  });

  const view = await renderPage(session);

  await expect.element(view.getByRole("button", { name: "Load more" })).toBeInTheDocument();
});

test("次のページがないときに Load more ボタンを表示しない", async () => {
  const session = createMockSession();
  const call = vi.spyOn(session.client, "call");

  call.mockImplementation((method) => {
    if (method === app.bsky.actor.getProfile) {
      return Promise.resolve(createProfile());
    }
    return Promise.resolve(createAuthorFeedPage([createFeedPost("first post", "1")]));
  });

  const view = await renderPage(session);

  expect(view.container.textContent).not.toContain("Load more");
});

test("次のページ取得中は Load more ボタンが disabled になる", async () => {
  const session = createMockSession();
  const call = vi.spyOn(session.client, "call");

  call.mockImplementation((method, params: { cursor?: string }) => {
    if (method === app.bsky.actor.getProfile) {
      return Promise.resolve(createProfile());
    }
    if (method === app.bsky.feed.getAuthorFeed) {
      if (params.cursor == null) {
        return Promise.resolve(
          createAuthorFeedPage([createFeedPost("first post", "1")], "cursor1"),
        );
      } else {
        return new Promise(() => {}); // Simulate pending state for the first page
      }
    }
    return Promise.resolve(createAuthorFeedPage([]));
  });

  const view = await renderPage(session);
  await view.getByRole("button", { name: "Load more" }).click();

  const button = view.getByRole("button", { name: "Load more", includeHidden: true });
  await expect.element(button).toBeDisabled();
});

test("Load more ボタンをクリックすると次のページ取得が実行される", async () => {
  const session = createMockSession();
  const call = vi.spyOn(session.client, "call");

  call.mockImplementation((method) => {
    if (method === app.bsky.actor.getProfile) {
      return Promise.resolve(createProfile());
    }
    if (method === app.bsky.feed.getAuthorFeed) {
      return Promise.resolve(createAuthorFeedPage([createFeedPost("first post", "1")], "cursor1"));
    }
    return Promise.resolve(createAuthorFeedPage([]));
  });

  const view = await renderPage(session);
  await expect.poll(() => call).toHaveBeenCalledTimes(2);
  await view.getByRole("button", { name: "Load more" }).click();

  await expect.poll(() => call).toHaveBeenCalledTimes(3);
  expect(call.mock.lastCall?.[0]).toBe(app.bsky.feed.getAuthorFeed);
});
