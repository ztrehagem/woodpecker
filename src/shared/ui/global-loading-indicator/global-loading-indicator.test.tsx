import { expect, test } from "vitest";
import { render } from "vitest-browser-react";

import { GlobalLoadingContext, GlobalLoadingStore } from "./global-loading-context.ts";
import { GlobalLoadingIndicator } from "./global-loading-indicator.tsx";

function renderGlobalLoadingIndicator(store: GlobalLoadingStore) {
  return render(
    <GlobalLoadingContext value={store}>
      <GlobalLoadingIndicator />
    </GlobalLoadingContext>,
  );
}

test("ローディング中の処理がない場合はグローバルローディングインジケーターを表示しない", async () => {
  const view = await renderGlobalLoadingIndicator(new GlobalLoadingStore());

  expect(view.container.firstElementChild).toBeNull();
});

test("ローディング中の処理がある場合は円形の進捗インジケーターをアニメーション付きで表示する", async () => {
  const store = new GlobalLoadingStore();
  store.add("fetch-timeline");
  const view = await renderGlobalLoadingIndicator(store);
  const icons = view.container.querySelectorAll("svg");

  expect(icons).toHaveLength(2);
  expect(icons[1]?.classList.contains("animate-spin")).toBe(true);
});

test("複数のローディング中の処理があり一部だけ完了した場合はグローバルローディングインジケーターを表示し続ける", async () => {
  const store = new GlobalLoadingStore();
  const view = await renderGlobalLoadingIndicator(store);

  store.add("fetch-timeline");
  store.add("fetch-notifications");
  store.remove("fetch-timeline");

  await expect.poll(() => view.container.querySelectorAll("svg").length).toBe(2);
});
