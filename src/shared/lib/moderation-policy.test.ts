import { expect, test } from "vitest";

import type { app, com } from "#src/shared/api/lexicons/index.ts";

import {
  getPostModerationPolicy,
  getProfileModerationPolicy,
  type Label,
  type ModerationPolicy,
} from "./moderation-policy";

function policy(overrides: Partial<ModerationPolicy> = {}): ModerationPolicy {
  return {
    hidden: false,
    muted: false,
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
    record: {
      $type: "app.bsky.feed.post",
      text: "hello muted phrase #quiettag",
      createdAt: "2024-01-01T00:00:00.000Z",
      facets: [
        {
          index: { byteStart: 19, byteEnd: 28 },
          features: [{ $type: "app.bsky.richtext.facet#tag", tag: "quiettag" }],
        },
      ],
    },
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
  expect(getPostModerationPolicy(post(void 0))).toEqual(policy());
  expect(getPostModerationPolicy(post([]))).toEqual(policy());
  expect(getProfileModerationPolicy(profile(void 0))).toEqual(policy());
});

test("detects !hide", () => {
  expect(getPostModerationPolicy(post([label("!hide")]))).toEqual(policy({ hidden: true }));
  expect(getProfileModerationPolicy(profile([label("!hide")]))).toEqual(policy({ hidden: true }));
});

test("detects !warn", () => {
  expect(getPostModerationPolicy(post([label("!warn")]))).toEqual(
    policy({ warned: [resolvedLabel("!warn")] }),
  );
});

const contentPreferences = {
  adultContentEnabled: true,
  labels: {},
  mutedWords: [],
};

test("hides a post containing a muted word", () => {
  expect(
    getPostModerationPolicy(post([]), {
      ...contentPreferences,
      mutedWords: [{ value: "muted phrase", targets: ["content"], actorTarget: "all" }],
    }),
  ).toEqual(policy({ hidden: true, muted: true }));
});

test("hides a post containing a muted hashtag", () => {
  expect(
    getPostModerationPolicy(post([]), {
      ...contentPreferences,
      mutedWords: [{ value: "quiettag", targets: ["tag"], actorTarget: "all" }],
    }),
  ).toEqual(policy({ hidden: true, muted: true }));
});

test("does not hide the viewer's own post", () => {
  expect(
    getPostModerationPolicy(
      post([]),
      {
        ...contentPreferences,
        mutedWords: [{ value: "muted phrase", targets: ["content"], actorTarget: "all" }],
      },
      "did:plc:alice",
    ),
  ).toEqual(policy());
});

test.each(["porn", "sexual", "nudity", "graphic-media"] as const)(
  "detects media label %s",
  (val) => {
    expect(getPostModerationPolicy(post([label(val)]))).toEqual(
      policy({ mediaWarned: [resolvedLabel(val)] }),
    );
  },
);

test("hides an adult media label configured as hide", () => {
  expect(
    getPostModerationPolicy(post([label("porn")]), {
      adultContentEnabled: true,
      labels: { porn: "hide" },
    }),
  ).toEqual(policy({ hidden: true }));
});

test("warns for an adult media label configured as warn", () => {
  expect(
    getPostModerationPolicy(post([label("porn")]), {
      adultContentEnabled: true,
      labels: { porn: "warn" },
    }),
  ).toEqual(policy({ mediaWarned: [resolvedLabel("porn")] }));
});

test("shows an adult media label configured as ignore", () => {
  expect(
    getPostModerationPolicy(post([label("porn")]), {
      adultContentEnabled: true,
      labels: { porn: "ignore" },
    }),
  ).toEqual(policy());
});

test("hides adult media when adult content is disabled", () => {
  expect(
    getPostModerationPolicy(post([label("porn")]), {
      adultContentEnabled: false,
      labels: { porn: "ignore" },
    }),
  ).toEqual(policy({ hidden: true }));
});

test("preserves the source when a post is self-labeled", () => {
  const selfLabel = label("porn");
  selfLabel.src = "did:plc:alice";

  expect(getPostModerationPolicy(post([selfLabel]))).toEqual(
    policy({ mediaWarned: [resolvedLabel("porn", "did:plc:alice")] }),
  );
});

test("collects media and generic warning labels separately", () => {
  expect(getPostModerationPolicy(post([label("porn"), label("!warn")]))).toEqual(
    policy({
      warned: [resolvedLabel("!warn")],
      mediaWarned: [resolvedLabel("porn")],
    }),
  );
});

test("collects multiple media labels", () => {
  expect(getPostModerationPolicy(post([label("porn"), label("graphic-media")]))).toEqual(
    policy({
      mediaWarned: [resolvedLabel("porn"), resolvedLabel("graphic-media")],
    }),
  );
});

test("ignores a label that is negated before it was ever applied", () => {
  expect(getPostModerationPolicy(post([label("!hide", true)]))).toEqual(policy());
});

test("cancels an earlier label when a matching neg label follows", () => {
  const applied = label("!hide");
  const negated = label("!hide", true);

  expect(getPostModerationPolicy(post([applied, negated]))).toEqual(policy());
});

test("keeps a label active when the neg label from another source does not match", () => {
  const applied = label("!hide");
  const negated = label("!hide", true);
  negated.src = "did:plc:other-labeler";

  expect(getPostModerationPolicy(post([applied, negated]))).toEqual(policy({ hidden: true }));
});

test("re-applies a label if it is added again after being negated", () => {
  const applied = label("!hide");
  const negated = label("!hide", true);
  const reapplied = label("!hide");

  expect(getPostModerationPolicy(post([applied, negated, reapplied]))).toEqual(
    policy({ hidden: true }),
  );
});

test("cancels a bot profile badge when a matching neg label follows", () => {
  const applied = label("bot");
  const negated = label("bot", true);

  expect(getProfileModerationPolicy(profile([applied, negated]))).toEqual(policy());
});

test("ignores unknown label values", () => {
  expect(getPostModerationPolicy(post([label("some-custom-label")]))).toEqual(policy());
});
