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

type ListNotificationsOutput = app.bsky.notification.listNotifications.$OutputBody;

const notification: app.bsky.notification.listNotifications.Notification = {
  uri: "at://did:plc:alice/app.bsky.feed.post/1",
  cid: "bafyreib3",
  author: {
    did: "did:plc:alice",
    handle: "alice.test",
    displayName: "Alice",
    avatar: void 0,
  },
  reason: "like",
  record: {
    $type: "app.bsky.feed.post",
    text: "liked post",
    createdAt: "2024-01-01T00:00:00.000Z",
  },
  isRead: false,
  indexedAt: "2024-01-01T00:00:00.000Z",
};

function mockLexCall(session: Session): Mock<() => Promise<ListNotificationsOutput>> {
  return vi.spyOn(session.client, "call") as unknown as Mock<
    () => Promise<ListNotificationsOutput>
  >;
}

function renderPage(session: Session) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

  return render(
    <QueryClientProvider client={queryClient}>
      <AtProtoMockProvider session={session}>
        <MemoryRouter>
          <Suspense>
            <Page />
          </Suspense>
        </MemoryRouter>
      </AtProtoMockProvider>
    </QueryClientProvider>,
  );
}

test("通知が 0 件のときに No notifications. を表示する", async () => {
  const session = createMockSession();
  mockLexCall(session).mockResolvedValue({ notifications: [] });

  const view = await renderPage(session);

  await expect.element(view.getByText("No notifications.", { exact: true })).toBeInTheDocument();
});

test("通知が表示される", async () => {
  const session = createMockSession();
  mockLexCall(session).mockResolvedValue({ notifications: [notification] });

  const view = await renderPage(session);

  await expect
    .element(view.getByText("Alice liked your post", { exact: true }))
    .toBeInTheDocument();
});

test("次のページがあるときに Load more ボタンを表示する", async () => {
  const session = createMockSession();
  mockLexCall(session).mockResolvedValue({ notifications: [notification], cursor: "cursor1" });

  const view = await renderPage(session);

  await expect.element(view.getByRole("button", { name: "Load more" })).toBeInTheDocument();
});

test("dataがないときでもerrorを表示する", async () => {
  const session = createMockSession();
  mockLexCall(session).mockRejectedValue(new Error("Failed to load notifications"));

  const view = await renderPage(session);

  await expect
    .element(view.getByText("Failed to load notifications", { exact: true }))
    .toBeInTheDocument();
});
