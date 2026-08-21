import { expect, test } from "vitest";

import type { app } from "#src/shared/api/lexicons/index.ts";
import { renderWithProviders } from "#src/test/render-with-providers.tsx";

import { ProfileListItem } from "./profile-list-item.tsx";

test("フォローボタンが表示される", async () => {
  const profile = {
    did: "did:plc:alice",
    handle: "alice.test",
  } as app.bsky.actor.defs.ProfileView;
  const view = await renderWithProviders(<ProfileListItem profile={profile} />, {
    initialEntries: ["/"],
  });

  await expect.element(view.getByRole("button", { name: "Follow" })).toBeInTheDocument();
});
