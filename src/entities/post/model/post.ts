import type { app } from "#src/shared/api/lexicons/index.ts";

type PostThreadOutput = app.bsky.feed.getPostThread.$Output["body"];

export type Thread = PostThreadOutput["thread"];
export type ThreadGate = PostThreadOutput["threadgate"];
export type ThreadViewPost = app.bsky.feed.defs.ThreadViewPost;
export type Post = app.bsky.feed.post.Main;
export type PostView = app.bsky.feed.defs.PostView;
export type PostReason = app.bsky.feed.defs.FeedViewPost["reason"];
export type PostReasonRepost = app.bsky.feed.defs.ReasonRepost;
