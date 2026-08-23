import { expect, test } from "vitest";

import type { app, com } from "#src/shared/api/lexicons/index.ts";
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

function label(val: string): com.atproto.label.defs.Label {
  return {
    src: "did:plc:labeler",
    uri: "at://did:plc:alice/app.bsky.actor.profile/self",
    val,
    cts: "2024-01-01T00:00:00.000Z",
  };
}

test("botラベルが付与されている場合、Botバッジが表示される", async () => {
  const profile = {
    did: "did:plc:alice",
    handle: "alice.test",
    displayName: "Alice",
    labels: [label("bot")],
  } as app.bsky.actor.defs.ProfileView;
  const view = await renderWithProviders(<ProfileListItem profile={profile} />, {
    initialEntries: ["/"],
  });

  await expect.element(view.getByText("Bot")).toBeInTheDocument();
});
