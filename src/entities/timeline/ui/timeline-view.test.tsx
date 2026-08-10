import { MemoryRouter } from "react-router";
import { expect, test } from "vitest";
import { render } from "vitest-browser-react";

import type { FeedViewPost } from "../model/feed-view-post";
import { TimelineView } from "./timeline-view";

test("renders external embeds", async () => {
  const post = {
    post: {
      uri: "at://did/app.bsky.feed.post/1",
      cid: "bafyreib3",
      author: {
        did: "did:plc:example",
        handle: "alice.test",
        displayName: "Alice",
        avatar: null,
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
    },
  } as unknown as FeedViewPost;

  const view = await render(
    <MemoryRouter>
      <TimelineView feed={[post]} />
    </MemoryRouter>,
  );

  await expect.element(view.getByText("Example", { exact: true })).toBeInTheDocument();
});

test("renders embedded record post content", async () => {
  const post = {
    post: {
      uri: "at://did/app.bsky.feed.post/1",
      cid: "bafyreib3",
      author: {
        did: "did:plc:example",
        handle: "alice.test",
        displayName: "Alice",
        avatar: null,
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
          uri: "at://did/app.bsky.feed.post/2",
          value: {
            $type: "app.bsky.feed.post",
            text: "Embedded post",
            createdAt: "2024-01-02T00:00:00.000Z",
          },
          author: {
            did: "did:plc:embed",
            handle: "bob.test",
            displayName: "Bob",
            avatar: null,
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
    },
  } as unknown as FeedViewPost;

  const view = await render(
    <MemoryRouter>
      <TimelineView feed={[post]} />
    </MemoryRouter>,
  );

  await expect.element(view.getByRole("link", { name: "Bob" })).toBeInTheDocument();
  await expect.element(view.getByText("Embedded post", { exact: true })).toBeInTheDocument();
});

test("renders nested embeds inside embedded record posts", async () => {
  const post = {
    post: {
      uri: "at://did/app.bsky.feed.post/1",
      cid: "bafyreib3",
      author: {
        did: "did:plc:example",
        handle: "alice.test",
        displayName: "Alice",
        avatar: null,
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
          uri: "at://did/app.bsky.feed.post/2",
          value: {
            $type: "app.bsky.feed.post",
            text: "Embedded post",
            createdAt: "2024-01-02T00:00:00.000Z",
            embed: {
              $type: "app.bsky.embed.external#view",
              external: {
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
            avatar: null,
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
    },
  } as unknown as FeedViewPost;

  const view = await render(
    <MemoryRouter>
      <TimelineView feed={[post]} />
    </MemoryRouter>,
  );

  await expect.element(view.getByText("Embedded Link", { exact: true })).toBeInTheDocument();
});
