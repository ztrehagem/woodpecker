import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Suspense } from "react";
import { afterEach, expect, test, vi } from "vitest";
import { render } from "vitest-browser-react";
import { userEvent } from "vitest/browser";

import type { app } from "#src/shared/api/lexicons/index.ts";
import { AtProtoMockProvider } from "#src/test/atproto-mock-provider.tsx";
import { createMockSession } from "#src/test/atproto-mock.ts";

import { NewPostDialog } from "./new-post-dialog";
import { createNewPostDialogContext, NewPostDialogContext } from "./new-post-dialog-context";

const profile: app.bsky.actor.defs.ProfileViewDetailed = {
  did: "did:plc:alice",
  handle: "alice.test",
  displayName: "Alice",
  avatar: "https://example.com/avatar.jpg",
};

function createMockFetchResponse() {
  return {
    ok: true,
    json: async () => ({
      url: "https://example.com/path",
      title: "Example Title",
      description: "Example description",
      image: "https://example.com/thumb.jpg",
    }),
  } as Response;
}

afterEach(() => {
  vi.restoreAllMocks();
});

function renderDialog(session = createMockSession()) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

  return render(
    <QueryClientProvider client={queryClient}>
      <AtProtoMockProvider session={session}>
        <NewPostDialogContext value={createNewPostDialogContext()}>
          <Suspense>
            <NewPostDialog.Trigger render={(props) => <button type="button" {...props} />}>
              Open dialog
            </NewPostDialog.Trigger>
            <NewPostDialog />
          </Suspense>
        </NewPostDialogContext>
      </AtProtoMockProvider>
    </QueryClientProvider>,
  );
}

async function openDialog(view: Awaited<ReturnType<typeof render>>) {
  await view.getByRole("button", { name: "Open dialog" }).click();
}

function getTextarea(view: Awaited<ReturnType<typeof render>>) {
  return view.getByRole("textbox");
}

test("タイトルが表示される", async () => {
  const session = createMockSession();
  vi.spyOn(session.client, "call").mockResolvedValue(profile as never);

  const view = await renderDialog(session);
  await openDialog(view);

  await expect.element(view.getByRole("heading", { name: "New post" })).toBeInTheDocument();
});

test("プロフィールが表示される", async () => {
  const session = createMockSession();
  vi.spyOn(session.client, "call").mockResolvedValue(profile as never);

  const view = await renderDialog(session);
  await openDialog(view);

  await expect.element(view.getByText("Alice", { exact: true })).toBeInTheDocument();
  await expect.element(view.getByText("@alice.test", { exact: true })).toBeInTheDocument();
  await expect
    .element(view.getByAltText(""))
    .toHaveAttribute("src", "https://example.com/avatar.jpg");
});

test("テキストエリアが表示される", async () => {
  const session = createMockSession();
  vi.spyOn(session.client, "call").mockResolvedValue(profile as never);

  const view = await renderDialog(session);
  await openDialog(view);

  await expect.element(getTextarea(view)).toBeInTheDocument();
});

test("テキストエリアに入力できる", async () => {
  const session = createMockSession();
  vi.spyOn(session.client, "call").mockResolvedValue(profile as never);

  const view = await renderDialog(session);
  await openDialog(view);
  const textarea = getTextarea(view);

  await textarea.fill("hello");

  await expect.element(textarea).toHaveValue("hello");
});

test("入力文字数が表示される", async () => {
  const session = createMockSession();
  vi.spyOn(session.client, "call").mockResolvedValue(profile as never);

  const view = await renderDialog(session);
  await openDialog(view);
  const textarea = getTextarea(view);

  await textarea.fill("hello");

  await expect.element(view.getByText("5 / 300", { exact: true })).toBeInTheDocument();
});

test("URLを入力すると埋め込みプレビューが表示される", async () => {
  const session = createMockSession();
  vi.spyOn(session.client, "call").mockResolvedValue(profile as never);
  vi.spyOn(globalThis, "fetch").mockResolvedValue(createMockFetchResponse());

  const view = await renderDialog(session);
  await openDialog(view);
  const textarea = getTextarea(view);

  await textarea.fill("https://example.com/path");
  await vi.waitFor(() => {
    expect(globalThis.fetch).toHaveBeenCalledTimes(1);
  });

  await expect.element(view.getByRole("link", { name: "Example Title" })).toBeInTheDocument();
});

test("複数のURLを入力すると最初のURLのみ埋め込みプレビューが表示される", async () => {
  const session = createMockSession();
  vi.spyOn(session.client, "call").mockResolvedValue(profile as never);
  const fetchSpy = vi.spyOn(globalThis, "fetch").mockImplementation(async (input) => {
    const target = new URL(input as string | URL).searchParams.get("url");
    const isFirst = target === "https://example.com/first";
    return {
      ok: true,
      json: async () => ({
        url: target,
        title: isFirst ? "First Title" : "Second Title",
        description: "",
        image: "",
      }),
    } as Response;
  });

  const view = await renderDialog(session);
  await openDialog(view);
  const textarea = getTextarea(view);

  await textarea.fill("https://example.com/first https://example.com/second");
  await vi.waitFor(() => {
    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });

  const [requestedEndpoint] = fetchSpy.mock.calls[0]!;
  expect(new URL(requestedEndpoint as string | URL).searchParams.get("url")).toBe(
    "https://example.com/first",
  );

  await expect.element(view.getByRole("link", { name: "First Title" })).toBeInTheDocument();
  await expect.element(view.getByRole("link", { name: "Second Title" })).not.toBeInTheDocument();
});

test("URLを削除すると埋め込みプレビューが消える", async () => {
  const session = createMockSession();
  vi.spyOn(session.client, "call").mockResolvedValue(profile as never);
  vi.spyOn(globalThis, "fetch").mockResolvedValue(createMockFetchResponse());

  const view = await renderDialog(session);
  await openDialog(view);
  const textarea = getTextarea(view);

  await textarea.fill("https://example.com/path");
  await vi.waitFor(() => {
    expect(globalThis.fetch).toHaveBeenCalledTimes(1);
  });
  await expect.element(view.getByRole("link", { name: "Example Title" })).toBeInTheDocument();

  await textarea.fill("");

  await expect.element(view.getByRole("link", { name: "Example Title" })).not.toBeInTheDocument();
});

test("キャンセルボタンを押すとダイアログが閉じる", async () => {
  const session = createMockSession();
  vi.spyOn(session.client, "call").mockResolvedValue(profile as never);

  const view = await renderDialog(session);
  await openDialog(view);

  await view.getByRole("button", { name: "Cancel" }).click();

  await expect.element(view.getByRole("heading", { name: "New post" })).not.toBeInTheDocument();
});

test("投稿ボタンを押すと投稿されてダイアログが閉じる", async () => {
  const session = createMockSession();
  vi.spyOn(session.client, "call").mockResolvedValue(profile as never);
  const postSpy = vi.spyOn(session.agent, "post").mockResolvedValue({
    uri: "at://did:plc:alice/app.bsky.feed.post/1",
    cid: "bafyreib3",
  } as never);

  const view = await renderDialog(session);
  await openDialog(view);
  const textarea = getTextarea(view);

  await textarea.fill("hello");
  await view.getByRole("button", { name: "Send" }).click();

  expect(postSpy).toHaveBeenCalledTimes(1);
  await expect.element(view.getByRole("heading", { name: "New post" })).not.toBeInTheDocument();
});

test("テキストエリアでCtrl+Enterを押すと投稿できる", async () => {
  const session = createMockSession();
  vi.spyOn(session.client, "call").mockResolvedValue(profile as never);
  const postSpy = vi.spyOn(session.agent, "post").mockResolvedValue({
    uri: "at://did:plc:alice/app.bsky.feed.post/1",
    cid: "bafyreib3",
  } as never);

  const view = await renderDialog(session);
  await openDialog(view);
  const textarea = getTextarea(view);

  await textarea.fill("hello");
  await userEvent.keyboard("{Control>}{Enter}{/Control}");

  expect(postSpy).toHaveBeenCalledTimes(1);
  await expect.element(view.getByRole("heading", { name: "New post" })).not.toBeInTheDocument();
});

test("テキストエリアでCmd+Enterを押すと投稿できる", async () => {
  const session = createMockSession();
  vi.spyOn(session.client, "call").mockResolvedValue(profile as never);
  const postSpy = vi.spyOn(session.agent, "post").mockResolvedValue({
    uri: "at://did:plc:alice/app.bsky.feed.post/1",
    cid: "bafyreib3",
  } as never);

  const view = await renderDialog(session);
  await openDialog(view);
  const textarea = getTextarea(view);

  await textarea.fill("hello");
  await userEvent.keyboard("{Meta>}{Enter}{/Meta}");

  expect(postSpy).toHaveBeenCalledTimes(1);
  await expect.element(view.getByRole("heading", { name: "New post" })).not.toBeInTheDocument();
});

test("投稿に失敗するとエラーメッセージが表示される", async () => {
  const session = createMockSession();
  vi.spyOn(session.client, "call").mockResolvedValue(profile as never);
  vi.spyOn(session.agent, "post").mockRejectedValue(new Error("Failed to create post"));

  const view = await renderDialog(session);
  await openDialog(view);
  const textarea = getTextarea(view);

  await textarea.fill("hello");
  await view.getByRole("button", { name: "Send" }).click();

  await expect.element(view.getByText("Failed to create post")).toBeInTheDocument();
  await expect.element(view.getByRole("heading", { name: "New post" })).toBeInTheDocument();
});
