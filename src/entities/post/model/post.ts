import type { app } from "#src/shared/api/lexicons/index.ts";

type PostThreadOutput = app.bsky.feed.getPostThread.$Output["body"];

export type Thread = PostThreadOutput["thread"];
export type ThreadGate = PostThreadOutput["threadgate"];
export type ThreadViewPost = app.bsky.feed.defs.ThreadViewPost;
export type Post = app.bsky.feed.defs.PostView;
