import type { BskyPreferences } from "@atproto/api";
import { expect, test, vi, type MockInstance } from "vitest";

import { app } from "#src/shared/api/lexicons/index.ts";
import type { Session } from "#src/shared/auth/index.ts";
import { createMockSession as createSession } from "#src/test/atproto-mock.ts";
import { renderWithProviders } from "#src/test/render-with-providers.tsx";

import { Page } from "./page.tsx";

const clientCallSpies = new WeakMap<Session, MockInstance>();

function createMockSession(
  did?: Parameters<typeof createSession>[0],
  {
    mutes = [],
    blocks = [],
  }: {
    mutes?: app.bsky.actor.defs.ProfileView[];
    blocks?: app.bsky.actor.defs.ProfileView[];
  } = {},
) {
  const session = createSession(did);
  const call = vi.spyOn(session.client, "call").mockImplementation((method) => {
    if (method === app.bsky.graph.getMutes) {
      return Promise.resolve({ mutes });
    }
    if (method === app.bsky.graph.getBlocks) {
      return Promise.resolve({ blocks });
    }
    return Promise.resolve({});
  });
  clientCallSpies.set(session, call);
  return session;
}

function preferences(
  adultContentEnabled: boolean,
  labels: Record<string, "hide" | "warn" | "ignore"> = {
    porn: "hide",
    sexual: "warn",
    nudity: "ignore",
    "graphic-media": "warn",
  },
): BskyPreferences {
  return {
    moderationPrefs: { adultContentEnabled, labels, mutedWords: [] },
  } as unknown as BskyPreferences;
}

function profile(
  did: string,
  handle: string,
  displayName: string,
  blocking?: string,
): app.bsky.actor.defs.ProfileView {
  return {
    did,
    handle,
    displayName,
    ...(blocking == null || blocking === "" ? {} : { viewer: { blocking } }),
  } as app.bsky.actor.defs.ProfileView;
}

test("成人向けコンテンツの現在の設定を表示する", async () => {
  const session = createMockSession();
  vi.spyOn(session.agent, "getPreferences").mockResolvedValue(preferences(true));

  const view = await renderWithProviders(<Page />, { session });

  await expect.element(view.getByRole("switch", { name: "Show adult content" })).toBeChecked();
});

test("成人向けコンテンツの設定を保存する", async () => {
  const session = createMockSession();
  vi.spyOn(session.agent, "getPreferences").mockResolvedValue(preferences(false));
  const setAdultContentEnabled = vi
    .spyOn(session.agent, "setAdultContentEnabled")
    .mockResolvedValue();
  const view = await renderWithProviders(<Page />, { session });
  const toggle = view.getByRole("switch", { name: "Show adult content" });

  await expect.element(toggle).not.toBeChecked();
  await toggle.click();

  expect(setAdultContentEnabled).toHaveBeenCalledWith(true);
});

test("ラベルごとの表示設定を保存する", async () => {
  const session = createMockSession();
  vi.spyOn(session.agent, "getPreferences").mockResolvedValue(preferences(true));
  const setContentLabelPref = vi.spyOn(session.agent, "setContentLabelPref").mockResolvedValue();
  const view = await renderWithProviders(<Page />, { session });
  const pornography = view.getByLabelText("Pornography");

  await expect.element(pornography).toHaveTextContent("Hide");
  await pornography.click();
  await view.getByRole("option", { name: "Show" }).click();

  expect(setContentLabelPref).toHaveBeenCalledWith("porn", "ignore");
});

test("成人向けコンテンツが無効なときはラベルごとの設定を変更できない", async () => {
  const session = createMockSession();
  vi.spyOn(session.agent, "getPreferences").mockResolvedValue(preferences(false));

  const view = await renderWithProviders(<Page />, { session });

  await expect.element(view.getByLabelText("Pornography")).toBeDisabled();
});

test("ミュートワードを保存する", async () => {
  const session = createMockSession();
  vi.spyOn(session.agent, "getPreferences").mockResolvedValue(preferences(true));
  const addMutedWord = vi.spyOn(session.agent, "addMutedWord").mockResolvedValue();
  const view = await renderWithProviders(<Page />, { session });

  await view.getByLabelText("Word to mute").fill("spoiler");
  await view.getByRole("button", { name: "Add" }).click();

  expect(addMutedWord).toHaveBeenCalledWith({
    value: "spoiler",
    targets: ["content"],
    actorTarget: "all",
    expiresAt: void 0,
  });
});

test("ミュートするハッシュタグを保存する", async () => {
  const session = createMockSession();
  vi.spyOn(session.agent, "getPreferences").mockResolvedValue(preferences(true));
  const addMutedWord = vi.spyOn(session.agent, "addMutedWord").mockResolvedValue();
  const view = await renderWithProviders(<Page />, { session });

  await view.getByRole("radio", { name: "Hashtag" }).click();
  await view.getByLabelText("Hashtag to mute").fill("#news");
  await view.getByRole("button", { name: "Add" }).click();

  expect(addMutedWord).toHaveBeenCalledWith(
    expect.objectContaining({ value: "news", targets: ["tag"] }),
  );
});

test("フォローしていないユーザーを対象にミュートワードを保存する", async () => {
  const session = createMockSession();
  vi.spyOn(session.agent, "getPreferences").mockResolvedValue(preferences(true));
  const addMutedWord = vi.spyOn(session.agent, "addMutedWord").mockResolvedValue();
  const view = await renderWithProviders(<Page />, { session });

  await view.getByRole("radio", { name: "People you don't follow" }).click();
  await view.getByLabelText("Word to mute").fill("spoiler");
  await view.getByRole("button", { name: "Add" }).click();

  expect(addMutedWord).toHaveBeenCalledWith(
    expect.objectContaining({ actorTarget: "exclude-following" }),
  );
});

test("24時間の有効期限でミュートワードを保存する", async () => {
  const session = createMockSession();
  vi.spyOn(session.agent, "getPreferences").mockResolvedValue(preferences(true));
  const addMutedWord = vi.spyOn(session.agent, "addMutedWord").mockResolvedValue();
  const view = await renderWithProviders(<Page />, { session });

  await view.getByRole("radio", { name: "24 hours" }).click();
  await view.getByLabelText("Word to mute").fill("spoiler");
  const earliestExpiration = Date.now() + 24 * 60 * 60 * 1000;
  await view.getByRole("button", { name: "Add" }).click();
  const latestExpiration = Date.now() + 24 * 60 * 60 * 1000;

  const expiresAt = addMutedWord.mock.calls[0]?.[0].expiresAt;
  expect(expiresAt).toBeDefined();
  expect(new Date(expiresAt ?? 0).getTime()).toBeGreaterThanOrEqual(earliestExpiration);
  expect(new Date(expiresAt ?? 0).getTime()).toBeLessThanOrEqual(latestExpiration);
});

test("ミュートワードを削除する", async () => {
  const session = createMockSession();
  const currentPreferences = preferences(true);
  currentPreferences.moderationPrefs.mutedWords = [
    { id: "1", value: "spoiler", targets: ["content"], actorTarget: "all" },
  ];
  vi.spyOn(session.agent, "getPreferences").mockResolvedValue(currentPreferences);
  const removeMutedWords = vi.spyOn(session.agent, "removeMutedWords").mockResolvedValue();
  const view = await renderWithProviders(<Page />, { session });

  await view.getByRole("button", { name: "Remove spoiler" }).click();

  expect(removeMutedWords).toHaveBeenCalledWith([currentPreferences.moderationPrefs.mutedWords[0]]);
});

test("ミュート中のユーザーを表示して解除する", async () => {
  const session = createMockSession(void 0, {
    mutes: [profile("did:plc:muted", "muted.test", "Muted User")],
  });
  vi.spyOn(session.agent, "getPreferences").mockResolvedValue(preferences(true));
  const view = await renderWithProviders(<Page />, {
    session,
    initialEntries: ["/settings"],
  });

  await expect.element(view.getByText("Muted User", { exact: true })).toBeVisible();
  await view.getByText("Unmute", { exact: true }).click();

  const call = clientCallSpies.get(session);
  if (call == null) {
    throw new Error("Client call spy was not initialized.");
  }
  expect(call).toHaveBeenCalledWith(app.bsky.graph.unmuteActor, {
    actor: "did:plc:muted",
  });
});

test("ブロック中のユーザーを表示して解除する", async () => {
  const session = createMockSession("did:plc:viewer" as never, {
    blocks: [
      profile(
        "did:plc:blocked",
        "blocked.test",
        "Blocked User",
        "at://did:plc:viewer/app.bsky.graph.block/block-key",
      ),
    ],
  });
  vi.spyOn(session.agent, "getPreferences").mockResolvedValue(preferences(true));
  const deleteBlock = vi.spyOn(session.client, "delete").mockResolvedValue({} as never);
  const view = await renderWithProviders(<Page />, {
    session,
    initialEntries: ["/settings"],
  });

  await expect.element(view.getByText("Blocked User", { exact: true })).toBeVisible();
  await view.getByText("Unblock", { exact: true }).click();

  expect(deleteBlock).toHaveBeenCalledWith(app.bsky.graph.block, { rkey: "block-key" });
});
