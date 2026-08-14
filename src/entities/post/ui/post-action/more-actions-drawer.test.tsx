import { Toast } from "@base-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { expect, test, vi } from "vitest";
import { render } from "vitest-browser-react";

import { app } from "#src/shared/api/lexicons/index.ts";
import { AtProtoMockProvider } from "#src/test/atproto-mock-provider.tsx";
import { createMockSession } from "#src/test/atproto-mock.ts";

import { MoreActionsDrawer } from "./more-actions-drawer";

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

const bookmarkedPostView: app.bsky.feed.defs.PostView = {
  ...defaultPostView,
  viewer: {
    $type: "app.bsky.feed.defs#viewerState",
    bookmarked: true,
  },
};

function renderView({
  postView = defaultPostView,
  isMine = false,
  onClickDelete = vi.fn<() => void>(),
  session = createMockSession(),
}: {
  postView?: app.bsky.feed.defs.PostView;
  isMine?: boolean;
  onClickDelete?: () => void;
  session?: Awaited<ReturnType<typeof createMockSession>>;
} = {}) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

  return render(
    <QueryClientProvider client={queryClient}>
      <AtProtoMockProvider session={session}>
        <Toast.Provider>
          <MoreActionsDrawer postView={postView} isMine={isMine} onClickDelete={onClickDelete} />,
        </Toast.Provider>
      </AtProtoMockProvider>
    </QueryClientProvider>,
  );
}

function openMenu(view: Awaited<ReturnType<typeof render>>) {
  return view.getByRole("button").click();
}

test("トリガーを押すとメニューが開く", async () => {
  const view = await renderView();

  await openMenu(view);

  await expect.element(view.getByRole("dialog")).toBeInTheDocument();
});

test("ブックマークボタンが表示される", async () => {
  const view = await renderView();

  await openMenu(view);

  await expect.element(view.getByRole("button", { name: "Save" })).toBeInTheDocument();
});

test("ブックマークボタンを押すと、ブックマークに追加される", async () => {
  const session = createMockSession();
  const spy = vi.spyOn(session.client, "call").mockResolvedValue({} as never);

  const view = await renderView({ session });
  await openMenu(view);

  const saveButton = view.getByRole("button", { name: "Save" });
  await saveButton.click();

  expect(spy).toHaveBeenCalledTimes(1);
  expect(spy.mock.lastCall?.[0]).toBe(app.bsky.bookmark.createBookmark);
  expect(spy.mock.lastCall?.[1]).toEqual({ uri: defaultPostView.uri, cid: defaultPostView.cid });
});

test("ブックマークボタンを押すと、ブックマークから削除される", async () => {
  const session = createMockSession();
  const spy = vi.spyOn(session.client, "call").mockResolvedValue({} as never);
  const view = await renderView({ session, postView: bookmarkedPostView });
  await openMenu(view);

  await view.getByRole("button", { name: "Saved" }).click();

  expect(spy).toHaveBeenCalledTimes(1);
  expect(spy.mock.lastCall?.[0]).toBe(app.bsky.bookmark.deleteBookmark);
  expect(spy.mock.lastCall?.[1]).toEqual({ uri: defaultPostView.uri });
});

test("自分のポストの場合、削除ボタンが表示される", async () => {
  const view = await renderView({ isMine: true });

  await openMenu(view);

  const deleteButton = view.getByRole("button", { name: "Delete" });
  await expect.element(deleteButton).toBeInTheDocument();
});

test("自分のポストでない場合、削除ボタンは表示されない", async () => {
  const view = await renderView({ isMine: false });

  await openMenu(view);

  const deleteButton = view.getByRole("button", { name: "Delete" });
  await expect.element(deleteButton).not.toBeInTheDocument();
});

test("削除ボタンを押すと、onClickDeleteが呼ばれる（確認ダイアログを表示する）", async () => {
  const onClickDelete = vi.fn<() => void>();
  const view = await renderView({ isMine: true, onClickDelete });

  await openMenu(view);

  const deleteButton = view.getByRole("button", { name: "Delete" });
  await deleteButton.click();

  expect(onClickDelete).toHaveBeenCalledTimes(1);
});
