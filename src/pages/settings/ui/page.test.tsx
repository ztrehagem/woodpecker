import type { BskyPreferences } from "@atproto/api";
import { expect, test, vi } from "vitest";

import { createMockSession } from "#src/test/atproto-mock.ts";
import { renderWithProviders } from "#src/test/render-with-providers.tsx";

import { Page } from "./page.tsx";

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
    moderationPrefs: { adultContentEnabled, labels },
  } as BskyPreferences;
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
