import { expect, test } from "vitest";

import type { app, com } from "#src/shared/api/lexicons/index.ts";
import { renderWithProviders } from "#src/test/render-with-providers.tsx";

import { PostCard } from "./post-card";

function createLabel(val: string): com.atproto.label.defs.Label {
  return {
    src: "did:plc:labeler",
    uri: "at://did:plc:alice/app.bsky.feed.post/1",
    val,
    cts: "2024-01-01T00:00:00.000Z",
  };
}

function renderView(postView: app.bsky.feed.defs.PostView) {
  return renderWithProviders(<PostCard postView={postView} />, { initialEntries: ["/"] });
}

test("renders external embeds", async () => {
  const postView: app.bsky.feed.defs.PostView = {
    uri: "at://did:plc:alice/app.bsky.feed.post/1",
    cid: "bafyreib3",
    author: {
      did: "did:plc:example",
      handle: "alice.test",
      displayName: "Alice",
      avatar: void 0,
    },
    record: {
      $type: "app.bsky.feed.post",
      text: "hello",
      createdAt: "2024-01-01T00:00:00.000Z",
    },
    embed: {
      $type: "app.bsky.embed.external#view",
      external: {
        uri: "https://example.com",
        title: "Example",
        description: "An example page",
      },
    },
    indexedAt: "2024-01-01T00:00:00.000Z",
    replyCount: 0,
    repostCount: 0,
    quoteCount: 0,
    likeCount: 0,
    bookmarkCount: 0,
  };
  const view = await renderView(postView);

  await expect.element(view.getByText("Example", { exact: true })).toBeInTheDocument();
});

test("renders embedded record post content", async () => {
  const postView: app.bsky.feed.defs.PostView = {
    uri: "at://did:plc:alice/app.bsky.feed.post/1",
    cid: "bafyreib3",
    author: {
      did: "did:plc:example",
      handle: "alice.test",
      displayName: "Alice",
      avatar: void 0,
    },
    record: {
      $type: "app.bsky.feed.post",
      text: "hello",
      createdAt: "2024-01-01T00:00:00.000Z",
    },
    embed: {
      $type: "app.bsky.embed.record#view",
      record: {
        $type: "app.bsky.embed.record#viewRecord",
        cid: "bafyreib3",
        uri: "at://did:plc:alice/app.bsky.feed.post/2",
        value: {
          $type: "app.bsky.feed.post",
          text: "Embedded post",
          createdAt: "2024-01-02T00:00:00.000Z",
        },
        author: {
          did: "did:plc:embed",
          handle: "bob.test",
          displayName: "Bob",
          avatar: void 0,
        },
        indexedAt: "2024-01-02T00:00:00.000Z",
        replyCount: 0,
        repostCount: 0,
        quoteCount: 0,
        likeCount: 0,
      },
    },
    indexedAt: "2024-01-01T00:00:00.000Z",
    replyCount: 0,
    repostCount: 0,
    quoteCount: 0,
    likeCount: 0,
    bookmarkCount: 0,
  };
  const view = await renderView(postView);

  await expect.element(view.getByRole("link", { name: "Bob" })).toBeInTheDocument();
  await expect.element(view.getByText("Embedded post", { exact: true })).toBeInTheDocument();
});

test("renders nested embeds inside embedded record posts", async () => {
  const postView: app.bsky.feed.defs.PostView = {
    uri: "at://did:plc:alice/app.bsky.feed.post/1",
    cid: "bafyreib3",
    author: {
      did: "did:plc:example",
      handle: "alice.test",
      displayName: "Alice",
      avatar: void 0,
    },
    record: {
      $type: "app.bsky.feed.post",
      text: "hello",
      createdAt: "2024-01-01T00:00:00.000Z",
    },
    embed: {
      $type: "app.bsky.embed.record#view",
      record: {
        $type: "app.bsky.embed.record#viewRecord",
        cid: "bafyreib3",
        uri: "at://did:plc:alice/app.bsky.feed.post/2",
        value: {
          $type: "app.bsky.feed.post",
          text: "Embedded post",
          createdAt: "2024-01-02T00:00:00.000Z",
          embed: {
            $type: "app.bsky.embed.external",
            external: {
              $type: "app.bsky.embed.external#external",
              uri: "https://example.com/embedded",
              title: "Embedded Link",
              description: "An embedded link",
            },
          },
        },
        author: {
          did: "did:plc:embed",
          handle: "bob.test",
          displayName: "Bob",
          avatar: void 0,
        },
        embeds: [
          {
            $type: "app.bsky.embed.external#view",
            external: {
              uri: "https://example.com/embedded",
              title: "Embedded Link",
              description: "An embedded link",
            },
          },
        ],
        indexedAt: "2024-01-02T00:00:00.000Z",
        replyCount: 0,
        repostCount: 0,
        quoteCount: 0,
        likeCount: 0,
      },
    },
    indexedAt: "2024-01-01T00:00:00.000Z",
    replyCount: 0,
    repostCount: 0,
    quoteCount: 0,
    likeCount: 0,
    bookmarkCount: 0,
  };
  const view = await renderView(postView);

  await expect.element(view.getByText("Embedded Link", { exact: true })).toBeInTheDocument();
});

function createPostView(
  overrides: Partial<app.bsky.feed.defs.PostView> = {},
): app.bsky.feed.defs.PostView {
  return {
    uri: "at://did:plc:alice/app.bsky.feed.post/1",
    cid: "bafyreib3",
    author: {
      did: "did:plc:example",
      handle: "alice.test",
      displayName: "Alice",
      avatar: void 0,
    },
    record: {
      $type: "app.bsky.feed.post",
      text: "hello",
      createdAt: "2024-01-01T00:00:00.000Z",
    },
    indexedAt: "2024-01-01T00:00:00.000Z",
    replyCount: 0,
    repostCount: 0,
    quoteCount: 0,
    likeCount: 0,
    bookmarkCount: 0,
    ...overrides,
  };
}

test("hides the post when labeled !hide", async () => {
  const postView = createPostView({ labels: [createLabel("!hide")] });
  const view = await renderView(postView);

  await expect.element(view.getByText("hello", { exact: true })).not.toBeInTheDocument();
  await expect
    .element(view.getByText("This post has been hidden due to a moderation label."))
    .toBeInTheDocument();
});

test("collapses the post content when labeled !warn, revealing it on click", async () => {
  const postView = createPostView({ labels: [createLabel("!warn")] });
  const view = await renderView(postView);

  const trigger = view.getByRole("button", { name: /^This content is warned\./ });
  await expect.element(trigger).toHaveAttribute("aria-expanded", "false");

  await trigger.click();

  await expect.element(trigger).toHaveAttribute("aria-expanded", "true");
});

test("collapses only the embed when labeled with a media label", async () => {
  const postView = createPostView({
    labels: [createLabel("porn")],
    embed: {
      $type: "app.bsky.embed.external#view",
      external: {
        uri: "https://example.com",
        title: "Example",
        description: "An example page",
      },
    },
  });
  const view = await renderView(postView);

  await expect.element(view.getByText("hello", { exact: true })).toBeInTheDocument();

  const trigger = view.getByRole("button", { name: /^This media may contain pornography\./ });
  await expect.element(trigger).toHaveAttribute("aria-expanded", "false");

  await trigger.click();

  await expect.element(trigger).toHaveAttribute("aria-expanded", "true");
});

test("marks the media warning as self-labeled when the author applied it themselves", async () => {
  const postView = createPostView({
    labels: [{ ...createLabel("porn"), src: "did:plc:example" }],
    embed: {
      $type: "app.bsky.embed.external#view",
      external: {
        uri: "https://example.com",
        title: "Example",
        description: "An example page",
      },
    },
  });
  const view = await renderView(postView);

  await view.getByRole("button", { name: "View labels", exact: true }).click();

  await expect.element(view.getByText("porn (self-labelled)", { exact: true })).toBeInTheDocument();
});

test("shows a bot badge when the author is labeled bot", async () => {
  const postView = createPostView();
  postView.author.labels = [createLabel("bot")];
  const view = await renderView(postView);

  await expect.element(view.getByText("Bot")).toBeInTheDocument();
});
