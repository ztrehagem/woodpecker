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
