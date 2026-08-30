import { expect, test } from "vitest";

import type { app, com } from "#src/shared/api/lexicons/index.ts";

import {
  getPostLabelPolicy,
  getProfileLabelPolicy,
  type Label,
  type LabelPolicy,
} from "./label-policy";

function policy(overrides: Partial<LabelPolicy> = {}): LabelPolicy {
  return {
    hidden: false,
    warned: [],
    mediaWarned: [],
    profileBadges: [],
    ...overrides,
  };
}

function resolvedLabel<Val extends string>(
  val: Val,
  src: Label["src"] = "did:plc:labeler",
  isProfile = false,
): Label<Val> {
  return { val, src, isProfile };
}

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

test("returns an empty policy when there are no labels", () => {
  expect(getPostLabelPolicy(post(void 0))).toEqual(policy());
  expect(getPostLabelPolicy(post([]))).toEqual(policy());
  expect(getProfileLabelPolicy(profile(void 0))).toEqual(policy());
});

test("detects !hide", () => {
  expect(getPostLabelPolicy(post([label("!hide")]))).toEqual(policy({ hidden: true }));
  expect(getProfileLabelPolicy(profile([label("!hide")]))).toEqual(policy({ hidden: true }));
});

test("detects !warn", () => {
  expect(getPostLabelPolicy(post([label("!warn")]))).toEqual(
    policy({ warned: [resolvedLabel("!warn")] }),
  );
});

test.each(["porn", "sexual", "nudity", "graphic-media"] as const)(
  "detects media label %s",
  (val) => {
    expect(getPostLabelPolicy(post([label(val)]))).toEqual(
      policy({ mediaWarned: [resolvedLabel(val)] }),
    );
  },
);

test("preserves the source when a post is self-labeled", () => {
  const selfLabel = label("porn");
  selfLabel.src = "did:plc:alice";

  expect(getPostLabelPolicy(post([selfLabel]))).toEqual(
    policy({ mediaWarned: [resolvedLabel("porn", "did:plc:alice")] }),
  );
});

test("collects media and generic warning labels separately", () => {
  expect(getPostLabelPolicy(post([label("porn"), label("!warn")]))).toEqual(
    policy({
      warned: [resolvedLabel("!warn")],
      mediaWarned: [resolvedLabel("porn")],
    }),
  );
});

test("collects multiple media labels", () => {
  expect(getPostLabelPolicy(post([label("porn"), label("graphic-media")]))).toEqual(
    policy({
      mediaWarned: [resolvedLabel("porn"), resolvedLabel("graphic-media")],
    }),
  );
});

test("ignores a label that is negated before it was ever applied", () => {
  expect(getPostLabelPolicy(post([label("!hide", true)]))).toEqual(policy());
});

test("cancels an earlier label when a matching neg label follows", () => {
  const applied = label("!hide");
  const negated = label("!hide", true);

  expect(getPostLabelPolicy(post([applied, negated]))).toEqual(policy());
});

test("keeps a label active when the neg label from another source does not match", () => {
  const applied = label("!hide");
  const negated = label("!hide", true);
  negated.src = "did:plc:other-labeler";

  expect(getPostLabelPolicy(post([applied, negated]))).toEqual(policy({ hidden: true }));
});

test("re-applies a label if it is added again after being negated", () => {
  const applied = label("!hide");
  const negated = label("!hide", true);
  const reapplied = label("!hide");

  expect(getPostLabelPolicy(post([applied, negated, reapplied]))).toEqual(policy({ hidden: true }));
});

test("ignores unknown label values", () => {
  expect(getPostLabelPolicy(post([label("some-custom-label")]))).toEqual(policy());
});
