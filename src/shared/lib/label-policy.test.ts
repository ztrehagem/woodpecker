import { expect, test } from "vitest";

import type { com } from "#src/shared/api/lexicons/index.ts";

import { getLabelPolicy } from "./label-policy";

function label(val: string, neg = false): com.atproto.label.defs.Label {
  return {
    src: "did:plc:labeler",
    uri: "at://did:plc:alice/app.bsky.feed.post/1",
    val,
    neg,
    cts: "2024-01-01T00:00:00.000Z",
  };
}

test("returns all-false policy when there are no labels", () => {
  expect(getLabelPolicy(void 0)).toEqual({
    hidden: false,
    warned: false,
    mediaWarningReason: null,
  });
  expect(getLabelPolicy([])).toEqual({ hidden: false, warned: false, mediaWarningReason: null });
});

test("detects !hide", () => {
  expect(getLabelPolicy([label("!hide")])).toEqual({
    hidden: true,
    warned: false,
    mediaWarningReason: null,
  });
});

test("detects !warn", () => {
  expect(getLabelPolicy([label("!warn")])).toEqual({
    hidden: false,
    warned: true,
    mediaWarningReason: null,
  });
});

test.each([
  ["porn", "This media may contain pornography (labeled by a moderation service)."],
  ["sexual", "This media may contain sexual content (labeled by a moderation service)."],
  ["nudity", "This media may contain nudity (labeled by a moderation service)."],
  ["graphic-media", "This media may contain graphic media (labeled by a moderation service)."],
])("detects media label %s with a distinct reason", (val, expectedReason) => {
  expect(getLabelPolicy([label(val)])).toEqual({
    hidden: false,
    warned: false,
    mediaWarningReason: expectedReason,
  });
});

test("marks the reason as self-labeled when the label source matches the author", () => {
  const selfLabel = label("porn");
  selfLabel.src = "did:plc:alice";

  expect(getLabelPolicy([selfLabel], "did:plc:alice")).toEqual({
    hidden: false,
    warned: false,
    mediaWarningReason: "This media may contain pornography (self-labeled).",
  });
});

test("combines multiple labels", () => {
  expect(getLabelPolicy([label("porn"), label("!warn")])).toEqual({
    hidden: false,
    warned: true,
    mediaWarningReason: "This media may contain pornography (labeled by a moderation service).",
  });
});

test("combines multiple media labels into a single reason", () => {
  expect(getLabelPolicy([label("porn"), label("graphic-media")])).toEqual({
    hidden: false,
    warned: false,
    mediaWarningReason:
      "This media may contain pornography (labeled by a moderation service), graphic media (labeled by a moderation service).",
  });
});

test("ignores negated labels", () => {
  expect(getLabelPolicy([label("!hide", true)])).toEqual({
    hidden: false,
    warned: false,
    mediaWarningReason: null,
  });
});

test("ignores unknown label values", () => {
  expect(getLabelPolicy([label("some-custom-label")])).toEqual({
    hidden: false,
    warned: false,
    mediaWarningReason: null,
  });
});
