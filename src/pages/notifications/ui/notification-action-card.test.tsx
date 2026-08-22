import { expect, test } from "vitest";

import { timeAgo } from "#src/entities/post/index.ts";
import type { app } from "#src/shared/api/lexicons/index.ts";
import { renderWithProviders } from "#src/test/render-with-providers.tsx";

import { NotificationActionCard } from "./notification-action-card";

function buildNotification(
  overrides: Partial<app.bsky.notification.listNotifications.Notification> = {},
): app.bsky.notification.listNotifications.Notification {
  return {
    uri: "at://did:plc:alice/app.bsky.feed.like/1",
    cid: "bafyreib3",
    author: {
      did: "did:plc:alice",
      handle: "alice.test",
      displayName: "Alice",
      avatar: void 0,
    },
    reason: "like",
    record: {
      $type: "app.bsky.feed.like",
      subject: { uri: "at://did:plc:bob/app.bsky.feed.post/1", cid: "bafypost" },
      createdAt: "2024-01-01T00:00:00.000Z",
    },
    isRead: false,
    indexedAt: "2024-01-01T00:00:00.000Z",
    ...overrides,
  };
}

function renderNotification(notification: app.bsky.notification.listNotifications.Notification) {
  return renderWithProviders(<NotificationActionCard notification={notification} />, {
    initialEntries: ["/"],
  });
}

test.each([
  { reason: "like", expected: "liked your post" },
  { reason: "like-via-repost", expected: "liked your repost" },
  { reason: "repost", expected: "reposted your post" },
  { reason: "repost-via-repost", expected: "reposted your repost" },
  { reason: "follow", expected: "followed you" },
] as const)("reason が $reason のときに $expected を表示する", async ({ reason, expected }) => {
  const notification = buildNotification({ reason });

  const view = await renderNotification(notification);

  await expect.element(view.getByText(expected, { exact: true })).toBeInTheDocument();
});

test("reason が like/like-via-repost/repost/repost-via-repost/follow 以外のときに reason の文字列をそのまま表示する", async () => {
  const notification = buildNotification({ reason: "contact-match" });

  const view = await renderNotification(notification);

  await expect.element(view.getByText("contact-match", { exact: true })).toBeInTheDocument();
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

test("author の displayName が未設定のときに handle をフォールバック表示する", async () => {
  const notification = buildNotification({
    author: { did: "did:plc:alice", handle: "alice.test", avatar: void 0 },
  });

  const view = await renderNotification(notification);

  await expect.element(view.getByRole("link", { name: "alice.test" })).toBeInTheDocument();
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

test("通知日時を相対時間表記で表示する", async () => {
  const createdAt = "2024-01-01T00:00:00.000Z";
  const notification = buildNotification({
    record: {
      $type: "app.bsky.feed.like",
      subject: { uri: "at://did:plc:bob/app.bsky.feed.post/1", cid: "bafypost" },
      createdAt,
    },
  });
  const expected = timeAgo(new Date(createdAt));

  const view = await renderNotification(notification);

  await expect.element(view.getByText(expected, { exact: true })).toBeInTheDocument();
});

test("通知日時にカーソルを合わせたときにロケール日時をツールチップで表示する", async () => {
  const createdAt = "2024-01-01T00:00:00.000Z";
  const notification = buildNotification({
    record: {
      $type: "app.bsky.feed.like",
      subject: { uri: "at://did:plc:bob/app.bsky.feed.post/1", cid: "bafypost" },
      createdAt,
    },
  });
  const expected = new Date(createdAt).toLocaleString();

  const view = await renderNotification(notification);

  view.getByRole("button").element().focus();

  await expect.element(view.getByText(expected, { exact: true })).toBeInTheDocument();
});

test("reason が follow のときに FollowProfileButton を表示する", async () => {
  const notification = buildNotification({ reason: "follow" });

  const view = await renderNotification(notification);

  await expect.element(view.getByRole("button", { name: "Follow" })).toBeInTheDocument();
});

test("reason が follow 以外のときに FollowProfileButton を表示しない", async () => {
  const notification = buildNotification({ reason: "like" });

  const view = await renderNotification(notification);

  expect(view.getByRole("button", { name: "Follow" }).query()).toBeNull();
});

test("reason が like で reasonSubject が存在するときに View post リンクを表示する", async () => {
  const notification = buildNotification({
    reason: "like",
    reasonSubject: "at://did:plc:bob/app.bsky.feed.post/99",
  });

  const view = await renderNotification(notification);

  await expect
    .element(view.getByRole("link", { name: "View post" }))
    .toHaveAttribute("href", "/profile/did:plc:bob/post/99");
});

test("reason が like で reasonSubject が未設定のときに View post リンクを表示しない", async () => {
  const notification = buildNotification({ reason: "like", reasonSubject: void 0 });

  const view = await renderNotification(notification);

  expect(view.getByRole("link", { name: "View post" }).query()).toBeNull();
});

test("reason が repost で reasonSubject が存在するときに View post リンクを表示する", async () => {
  const notification = buildNotification({
    reason: "repost",
    reasonSubject: "at://did:plc:bob/app.bsky.feed.post/99",
  });

  const view = await renderNotification(notification);

  await expect
    .element(view.getByRole("link", { name: "View post" }))
    .toHaveAttribute("href", "/profile/did:plc:bob/post/99");
});

test("reason が repost で reasonSubject が未設定のときに View post リンクを表示しない", async () => {
  const notification = buildNotification({ reason: "repost", reasonSubject: void 0 });

  const view = await renderNotification(notification);

  expect(view.getByRole("link", { name: "View post" }).query()).toBeNull();
});

test("reason が like-via-repost で record が like レコードのときに record.subject を参照した View post リンクを表示する", async () => {
  const notification = buildNotification({
    reason: "like-via-repost",
    record: {
      $type: "app.bsky.feed.like",
      subject: { uri: "at://did:plc:bob/app.bsky.feed.post/99", cid: "bafypost" },
      createdAt: "2024-01-01T00:00:00.000Z",
    },
  });

  const view = await renderNotification(notification);

  await expect
    .element(view.getByRole("link", { name: "View post" }))
    .toHaveAttribute("href", "/profile/did:plc:bob/post/99");
});

test("reason が repost-via-repost で record が repost レコードのときに record.subject を参照した View post リンクを表示する", async () => {
  const notification = buildNotification({
    reason: "repost-via-repost",
    record: {
      $type: "app.bsky.feed.repost",
      subject: { uri: "at://did:plc:bob/app.bsky.feed.post/99", cid: "bafypost" },
      createdAt: "2024-01-01T00:00:00.000Z",
    },
  });

  const view = await renderNotification(notification);

  await expect
    .element(view.getByRole("link", { name: "View post" }))
    .toHaveAttribute("href", "/profile/did:plc:bob/post/99");
});

test.each([
  {
    label: "reason が like-via-repost で record が like レコードでないとき",
    reason: "like-via-repost",
    record: { $type: "app.bsky.feed.repost", createdAt: "2024-01-01T00:00:00.000Z" },
  },
  {
    label: "reason が repost-via-repost で record が repost レコードでないとき",
    reason: "repost-via-repost",
    record: { $type: "app.bsky.feed.like", createdAt: "2024-01-01T00:00:00.000Z" },
  },
  {
    label: "reason が follow のとき",
    reason: "follow",
    record: { $type: "app.bsky.graph.follow", createdAt: "2024-01-01T00:00:00.000Z" },
  },
] as const)("$label に View post リンクを表示しない", async ({ reason, record }) => {
  const notification = buildNotification({ reason, record });

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
  const notification = buildNotification({
    reason: "like",
    reasonSubject: "at://did:plc:bob/app.bsky.feed.post/99",
  });

  const view = await renderNotification(notification);

  await expect
    .element(view.getByRole("link", { name: "View post" }))
    .toHaveAttribute("aria-label", "View post");
});

test("time 要素に dateTime 属性が ISO 日時文字列で設定される", async () => {
  const createdAt = "2024-01-01T00:00:00.000Z";
  const notification = buildNotification({
    record: {
      $type: "app.bsky.feed.like",
      subject: { uri: "at://did:plc:bob/app.bsky.feed.post/1", cid: "bafypost" },
      createdAt,
    },
  });

  const view = await renderNotification(notification);

  const time = view.container.querySelector("time");

  expect(time).not.toBeNull();
  expect(time?.getAttribute("dateTime")).toBe(createdAt);
});
