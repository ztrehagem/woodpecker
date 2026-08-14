import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Suspense } from "react";
import { MemoryRouter } from "react-router";
import { expect, test } from "vitest";
import { render } from "vitest-browser-react";

import type { app } from "#src/shared/api/lexicons/index.ts";
import { AtProtoMockProvider } from "#src/test/atproto-mock-provider.tsx";

import { TimelineUI } from "./timeline-ui";

test("renders external embeds", async () => {
  const post: app.bsky.feed.defs.FeedViewPost = {
    post: {
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
    },
  };
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const view = await render(
    <QueryClientProvider client={queryClient}>
      <AtProtoMockProvider>
        <MemoryRouter>
          <Suspense>
            <TimelineUI feed={[post]} />
          </Suspense>
        </MemoryRouter>
      </AtProtoMockProvider>
    </QueryClientProvider>,
  );

  await expect.element(view.getByText("Example", { exact: true })).toBeInTheDocument();
});

test("renders embedded record post content", async () => {
  const post: app.bsky.feed.defs.FeedViewPost = {
    post: {
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
    },
  };
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const view = await render(
    <QueryClientProvider client={queryClient}>
      <AtProtoMockProvider>
        <MemoryRouter>
          <Suspense>
            <TimelineUI feed={[post]} />
          </Suspense>
        </MemoryRouter>
      </AtProtoMockProvider>
    </QueryClientProvider>,
  );

  await expect.element(view.getByRole("link", { name: "Bob" })).toBeInTheDocument();
  await expect.element(view.getByText("Embedded post", { exact: true })).toBeInTheDocument();
});

test("renders nested embeds inside embedded record posts", async () => {
  const post: app.bsky.feed.defs.FeedViewPost = {
    post: {
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
    },
  };
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const view = await render(
    <QueryClientProvider client={queryClient}>
      <AtProtoMockProvider>
        <MemoryRouter>
          <Suspense>
            <TimelineUI feed={[post]} />
          </Suspense>
        </MemoryRouter>
      </AtProtoMockProvider>
    </QueryClientProvider>,
  );

  await expect.element(view.getByText("Embedded Link", { exact: true })).toBeInTheDocument();
});
