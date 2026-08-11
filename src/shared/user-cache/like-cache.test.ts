import { expect, test } from "vitest";

import type { app } from "#src/shared/api/lexicons/index.ts";

import { LikeCache } from "./like-cache";

function createPostView(liked: boolean): app.bsky.feed.defs.PostView {
  return {
    uri: "at://did/app.bsky.feed.post/1",
    cid: "bafyreib3",
    viewer: { like: liked ? "at://did/app.bsky.feed.like/1" : void 0 },
  } as unknown as app.bsky.feed.defs.PostView;
}

test.each([
  { liked: true, expectedValue: "at://did/app.bsky.feed.like/1" },
  { liked: false, expectedValue: null },
])("キャッシュに値がない場合は、viewer.like の値を返す", ({ liked, expectedValue }) => {
  const cache = new LikeCache();
  const view = createPostView(liked);

  expect(cache.get(view)).toBe(expectedValue);
});

test.each([
  { liked: true, cacheValue: "at://did/app.bsky.feed.like/2" },
  { liked: true, cacheValue: null },
  { liked: false, cacheValue: "at://did/app.bsky.feed.like/2" },
  { liked: false, cacheValue: null },
] as const)(
  "キャッシュに値が入っている場合は、viewer.like ではなくキャッシュの値を優先して返す",
  ({ liked, cacheValue }) => {
    const cache = new LikeCache();
    const view = createPostView(liked);

    cache.set(view, cacheValue);

    expect(cache.get(view)).toBe(cacheValue);
  },
);
