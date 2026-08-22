import { expect, test } from "vitest";

import { timeAgo } from "#src/entities/post/index.ts";
import type { app } from "#src/shared/api/lexicons/index.ts";
import { renderWithProviders } from "#src/test/render-with-providers.tsx";

import { NotificationPostCard } from "./notification-post-card";

function buildNotification(
  overrides: Partial<app.bsky.notification.listNotifications.Notification> = {},
): app.bsky.notification.listNotifications.Notification {
  return {
    uri: "at://did:plc:alice/app.bsky.feed.post/1",
    cid: "bafyreib3",
    author: {
      did: "did:plc:alice",
      handle: "alice.test",
      displayName: "Alice",
      avatar: void 0,
    },
    reason: "reply",
    record: {
      $type: "app.bsky.feed.post",
      text: "hello world",
      createdAt: "2024-01-01T00:00:00.000Z",
    },
    isRead: false,
    indexedAt: "2024-01-01T00:00:00.000Z",
    ...overrides,
  };
}

function renderNotification(notification: app.bsky.notification.listNotifications.Notification) {
  return renderWithProviders(<NotificationPostCard notification={notification} />, {
    initialEntries: ["/"],
  });
}

test.each([
  { reason: "reply", expected: "Replied to your post" },
  { reason: "quote", expected: "Quoted your post" },
  { reason: "mention", expected: "Mentioned you" },
] as const)("reason が $reason のときに $expected を表示する", async ({ reason, expected }) => {
  const notification = buildNotification({ reason });

  const view = await renderNotification(notification);

  await expect.element(view.getByText(expected, { exact: true })).toBeInTheDocument();
});

test("reason が reply/quote/mention 以外のときに reason 表示行を表示しない", async () => {
  const notification = buildNotification({ reason: "like" });

  const view = await renderNotification(notification);

  await expect.element(view.getByText("Alice", { exact: true })).toBeInTheDocument();
  expect(view.getByText("Replied to your post", { exact: true }).query()).toBeNull();
  expect(view.getByText("Quoted your post", { exact: true }).query()).toBeNull();
  expect(view.getByText("Mentioned you", { exact: true }).query()).toBeNull();
});

test("record が投稿レコードでないときに何も描画しない", async () => {
  const notification = buildNotification({
    record: { $type: "app.bsky.feed.like", createdAt: "2024-01-01T00:00:00.000Z" },
  });

  const view = await renderNotification(notification);

  expect(view.getByText("Alice", { exact: true }).query()).toBeNull();
  expect(view.container.textContent).toBe("");
});

test("author の displayName を表示する", async () => {
  const notification = buildNotification({
    author: {
      did: "did:plc:alice",
      handle: "alice.test",
      displayName: "Alice",
      avatar: void 0,
    },
  });

  const view = await renderNotification(notification);

  await expect.element(view.getByText("Alice", { exact: true })).toBeInTheDocument();
});

test("author の handle を @ 付きで表示する", async () => {
  const notification = buildNotification();

  const view = await renderNotification(notification);

  await expect.element(view.getByText("@alice.test", { exact: true })).toBeInTheDocument();
});

test("author の avatar があるときに画像を表示する", async () => {
  const notification = buildNotification({
    author: {
      did: "did:plc:alice",
      handle: "alice.test",
      displayName: "Alice",
      avatar: "https://example.com/avatar.png",
    },
  });

  const view = await renderNotification(notification);

  await expect
    .element(view.getByAltText(""))
    .toHaveAttribute("src", "https://example.com/avatar.png");
});

test("author の avatar がないときに画像を表示しない", async () => {
  const notification = buildNotification({
    author: {
      did: "did:plc:alice",
      handle: "alice.test",
      displayName: "Alice",
      avatar: void 0,
    },
  });

  const view = await renderNotification(notification);

  expect(view.getByAltText("").query()).toBeNull();
});

test("投稿本文をリッチテキストとして表示する", async () => {
  const notification = buildNotification({
    record: {
      $type: "app.bsky.feed.post",
      text: "hello from a notification",
      createdAt: "2024-01-01T00:00:00.000Z",
    },
  });

  const view = await renderNotification(notification);

  await expect
    .element(view.getByText("hello from a notification", { exact: true }))
    .toBeInTheDocument();
});

test("投稿日時を相対時間表記で表示する", async () => {
  const createdAt = "2024-01-01T00:00:00.000Z";
  const notification = buildNotification({
    record: { $type: "app.bsky.feed.post", text: "hello world", createdAt },
  });
  const expected = timeAgo(new Date(createdAt));

  const view = await renderNotification(notification);

  await expect.element(view.getByText(expected, { exact: true })).toBeInTheDocument();
});

test("投稿日時にカーソルを合わせたときにロケール日時をツールチップで表示する", async () => {
  const createdAt = "2024-01-01T00:00:00.000Z";
  const notification = buildNotification({
    record: { $type: "app.bsky.feed.post", text: "hello world", createdAt },
  });
  const expected = new Date(createdAt).toLocaleString();

  const view = await renderNotification(notification);

  view.getByRole("button").element().focus();

  await expect.element(view.getByText(expected, { exact: true })).toBeInTheDocument();
});

test("author の displayName が空文字のときに handle をフォールバック表示する", async () => {
  const notification = buildNotification({
    author: { did: "did:plc:alice", handle: "alice.test", displayName: "", avatar: void 0 },
  });

  const view = await renderNotification(notification);

  await expect.element(view.getByRole("link", { name: "alice.test" })).toBeInTheDocument();
});

test("author の displayName が未設定のときに handle をフォールバック表示する", async () => {
  const notification = buildNotification({
    author: { did: "did:plc:alice", handle: "alice.test", avatar: void 0 },
  });

  const view = await renderNotification(notification);

  await expect.element(view.getByRole("link", { name: "alice.test" })).toBeInTheDocument();
});

test("buildPostHref が有効な URL を返すときに投稿詳細への View post リンクを表示する", async () => {
  const notification = buildNotification({
    uri: "at://did:plc:alice/app.bsky.feed.post/1",
    author: {
      did: "did:plc:alice",
      handle: "alice.test",
      displayName: "Alice",
      avatar: void 0,
    },
  });

  const view = await renderNotification(notification);

  await expect
    .element(view.getByRole("link", { name: "View post" }))
    .toHaveAttribute("href", "/profile/alice.test/post/1");
});

test("buildPostHref が null を返すときに View post リンクを表示しない", async () => {
  const notification = buildNotification({
    uri: "at://did:plc:someone-else/app.bsky.feed.post/1",
    author: {
      did: "did:plc:alice",
      handle: "alice.test",
      displayName: "Alice",
      avatar: void 0,
    },
  });

  const view = await renderNotification(notification);

  expect(view.getByRole("link", { name: "View post" }).query()).toBeNull();
});

test("author のアバターと表示名から author のプロフィールへのリンクを表示する", async () => {
  const notification = buildNotification({
    author: {
      did: "did:plc:alice",
      handle: "alice.test",
      displayName: "Alice",
      avatar: "https://example.com/avatar.png",
    },
  });

  const view = await renderNotification(notification);

  await expect
    .element(view.getByRole("link", { name: "Alice" }))
    .toHaveAttribute("href", "/profile/alice.test");
});

test("View post リンクに aria-label が設定される", async () => {
  const notification = buildNotification();

  const view = await renderNotification(notification);

  await expect
    .element(view.getByRole("link", { name: "View post" }))
    .toHaveAttribute("aria-label", "View post");
});

test("time 要素に dateTime 属性が ISO 日時文字列で設定される", async () => {
  const createdAt = "2024-01-01T00:00:00.000Z";
  const notification = buildNotification({
    record: { $type: "app.bsky.feed.post", text: "hello world", createdAt },
  });

  const view = await renderNotification(notification);

  const time = view.container.querySelector("time");

  expect(time).not.toBeNull();
  expect(time?.getAttribute("dateTime")).toBe(createdAt);
});
