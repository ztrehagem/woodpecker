import { expect, test } from "vitest";

import type { app, com } from "#src/shared/api/lexicons/index.ts";

import { getPostLabelPolicy, getProfileLabelPolicy } from "./label-policy";

function label(val: string, neg = false): com.atproto.label.defs.Label {
  return {
    src: "did:plc:labeler",
    uri: "at://did:plc:alice/app.bsky.feed.post/1",
    val,
    neg,
    cts: "2024-01-01T00:00:00.000Z",
  };
}

function post(labels: com.atproto.label.defs.Label[] | undefined): app.bsky.feed.defs.PostView {
  return {
    uri: "at://did:plc:alice/app.bsky.feed.post/1",
    cid: "cid",
    author: { did: "did:plc:alice", handle: "alice.test" },
    record: {},
    indexedAt: "2024-01-01T00:00:00.000Z",
    labels,
  } as unknown as app.bsky.feed.defs.PostView;
}

function profile(
  labels: com.atproto.label.defs.Label[] | undefined,
): app.bsky.actor.defs.ProfileView {
  return {
    did: "did:plc:alice",
    handle: "alice.test",
    labels,
  } as unknown as app.bsky.actor.defs.ProfileView;
}

test("returns none policy when there are no labels", () => {
  expect(getPostLabelPolicy(post(void 0))).toEqual({ policy: "none" });
  expect(getPostLabelPolicy(post([]))).toEqual({ policy: "none" });
  expect(getProfileLabelPolicy(profile(void 0))).toEqual({ policy: "none" });
});

test("detects !hide", () => {
  expect(getPostLabelPolicy(post([label("!hide")]))).toEqual({ policy: "hidden" });
  expect(getProfileLabelPolicy(profile([label("!hide")]))).toEqual({ policy: "hidden" });
});

test("detects !warn", () => {
  expect(getPostLabelPolicy(post([label("!warn")]))).toEqual({
    policy: "warned",
    reasonText: "This content has a content warning.",
  });
});

test.each([
  ["porn", "This media may contain pornography (labeled by a moderation service)."],
  ["sexual", "This media may contain sexual content (labeled by a moderation service)."],
  ["nudity", "This media may contain nudity (labeled by a moderation service)."],
  ["graphic-media", "This media may contain graphic media (labeled by a moderation service)."],
])("detects media label %s with a distinct reason", (val, expectedReason) => {
  expect(getPostLabelPolicy(post([label(val)]))).toEqual({
    policy: "media-warned",
    reasonText: expectedReason,
  });
});

test("marks the reason as self-labeled when the label source matches the post author", () => {
  const selfLabel = label("porn");
  selfLabel.src = "did:plc:alice";

  expect(getPostLabelPolicy(post([selfLabel]))).toEqual({
    policy: "media-warned",
    reasonText: "This media may contain pornography (self-labeled).",
  });
});

test("prioritizes media label over generic warn", () => {
  expect(getPostLabelPolicy(post([label("porn"), label("!warn")]))).toEqual({
    policy: "media-warned",
    reasonText: "This media may contain pornography (labeled by a moderation service).",
  });
});

test("combines multiple media labels into a single reason", () => {
  expect(getPostLabelPolicy(post([label("porn"), label("graphic-media")]))).toEqual({
    policy: "media-warned",
    reasonText:
      "This media may contain pornography (labeled by a moderation service), graphic media (labeled by a moderation service).",
  });
});

test("ignores a label that is negated before it was ever applied", () => {
  expect(getPostLabelPolicy(post([label("!hide", true)]))).toEqual({ policy: "none" });
});

test("cancels an earlier label when a matching neg label follows", () => {
  const applied = label("!hide");
  const negated = label("!hide", true);

  expect(getPostLabelPolicy(post([applied, negated]))).toEqual({ policy: "none" });
});

test("keeps a label active when the neg label from another source does not match", () => {
  const applied = label("!hide");
  const negated = label("!hide", true);
  negated.src = "did:plc:other-labeler";

  expect(getPostLabelPolicy(post([applied, negated]))).toEqual({ policy: "hidden" });
});

test("re-applies a label if it is added again after being negated", () => {
  const applied = label("!hide");
  const negated = label("!hide", true);
  const reapplied = label("!hide");

  expect(getPostLabelPolicy(post([applied, negated, reapplied]))).toEqual({ policy: "hidden" });
});

test("ignores unknown label values", () => {
  expect(getPostLabelPolicy(post([label("some-custom-label")]))).toEqual({ policy: "none" });
});
