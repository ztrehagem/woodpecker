import { expect, test } from "vitest";
import { render } from "vitest-browser-react";

import type { app } from "#src/shared/api/lexicons/index.ts";

import { ExternalEmbedView } from "./external-embed-view.tsx";

function createEmbed(
  overrides: Partial<app.bsky.embed.external.ViewExternal> = {},
): app.bsky.embed.external.View {
  return {
    external: {
      uri: "https://example.com/path",
      title: "Example Title",
      description: "Example description",
      ...overrides,
    },
  } as app.bsky.embed.external.View;
}

test("URI が有効な URL のとき title リンクが表示される", async () => {
  const embed = createEmbed();
  const view = await render(<ExternalEmbedView embed={embed} />);

  await expect.element(view.getByRole("link", { name: "Example Title" })).toBeInTheDocument();
});

test("URI が無効な URL のとき何も描画されない", async () => {
  const embed = createEmbed({ uri: "not-a-url" as `${string}:${string}` });
  const view = await render(<ExternalEmbedView embed={embed} />);

  await expect.element(view.getByRole("link")).not.toBeInTheDocument();
});

test("title リンクの href が external.uri の値と一致する", async () => {
  const embed = createEmbed({ uri: "https://example.com/path" });
  const view = await render(<ExternalEmbedView embed={embed} />);

  await expect.element(view.getByRole("link")).toHaveAttribute("href", "https://example.com/path");
});

test("ホスト名が表示される", async () => {
  const embed = createEmbed({ uri: "https://example.com/path" });
  const view = await render(<ExternalEmbedView embed={embed} />);

  await expect.element(view.getByText("example.com")).toBeInTheDocument();
});

test('リンクが target="_blank" で開く', async () => {
  const embed = createEmbed();
  const view = await render(<ExternalEmbedView embed={embed} />);

  await expect.element(view.getByRole("link")).toHaveAttribute("target", "_blank");
});

test("description がある場合は description テキストが表示される", async () => {
  const embed = createEmbed({ description: "Some description" });
  const view = await render(<ExternalEmbedView embed={embed} />);

  await expect.element(view.getByText("Some description")).toBeInTheDocument();
});

test("description がない場合は description テキストが表示されない", async () => {
  const embed = createEmbed({ description: "" });
  const view = await render(<ExternalEmbedView embed={embed} />);

  await expect.element(view.getByText("Example description")).not.toBeInTheDocument();
});

test("thumb がある場合はサムネイル画像が表示される", async () => {
  const embed = createEmbed({ thumb: "https://example.com/thumb.jpg" });
  const view = await render(<ExternalEmbedView embed={embed} />);

  const img = view.getByAltText("");
  await expect.element(img).toBeInTheDocument();
  await expect.element(img).toHaveAttribute("src", "https://example.com/thumb.jpg");
});

test("thumb がない場合はサムネイル画像が表示されない", async () => {
  const embed = createEmbed({ thumb: void 0 });
  const view = await render(<ExternalEmbedView embed={embed} />);

  await expect.element(view.getByAltText("")).not.toBeInTheDocument();
});
