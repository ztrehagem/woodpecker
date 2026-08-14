import React, { useMemo } from "react";
import { Link } from "react-router";

import { PostCard } from "#src/entities/post/@x/timeline.ts";
import type { app } from "#src/shared/api/lexicons/index.ts";
import { MoreVertIcon } from "#src/shared/ui/icon/index.ts";

export function TimelineUI({
  feed,
}: {
  feed: readonly app.bsky.feed.defs.FeedViewPost[];
}): React.ReactElement {
  const timelineFeed = useMemo(() => createTimelineFeed(feed), [feed]);

  return (
    <div className="grid grid-cols-1 gap-2 tablet:gap-4">
      {timelineFeed.map((post) => (
        <TimelineItem key={post.post.uri} post={post} />
      ))}
    </div>
  );
}

function createTimelineFeed(
  rawFeed: readonly app.bsky.feed.defs.FeedViewPost[],
): readonly app.bsky.feed.defs.FeedViewPost[] {
  const filteredFeed: app.bsky.feed.defs.FeedViewPost[] = [];
  const listedThreadRootCids = new Set<string>();

  for (const feedPost of rawFeed) {
    const rootCid =
      feedPost.reply != null && isPostView(feedPost.reply.root) ? feedPost.reply.root.cid : null;

    // すでに表示済みのスレッドと同一スレッドなら無視
    const isAlreadyListed =
      (rootCid != null && listedThreadRootCids.has(rootCid)) ||
      listedThreadRootCids.has(feedPost.post.cid);
    if (isAlreadyListed) {
      continue;
    }

    // 単体の投稿はそのまま表示する
    if (feedPost.reply == null) {
      filteredFeed.push(feedPost);
      continue;
    }

    // typeを解決できなければ無視
    if (!isPostView(feedPost.reply.parent) || !isPostView(feedPost.reply.root)) {
      continue;
    }

    // rootのauthorと異なるなら無視
    const isRootSameAuthor = feedPost.reply.root.author.did == feedPost.post.author.did;
    if (!isRootSameAuthor) {
      continue;
    }

    // parentのauthorと異なるなら無視
    const isParentSameAuthor = feedPost.reply.parent.author.did == feedPost.post.author.did;
    if (!isParentSameAuthor) {
      continue;
    }

    filteredFeed.push(feedPost);
    listedThreadRootCids.add(feedPost.reply.root.cid);
  }

  return filteredFeed;
}

function isPostView(item: { $type: string }): item is { $type: "app.bsky.feed.defs#postView" } {
  return item.$type === "app.bsky.feed.defs#postView";
}

function isPost(item: object): item is app.bsky.feed.post.Main {
  return "$type" in item && item.$type === "app.bsky.feed.post";
}

function TimelineItem({ post }: { post: app.bsky.feed.defs.FeedViewPost }): React.ReactElement {
  if (post.reply?.parent == null) {
    return <PostCard postView={post.post} reason={post.reason} />;
  }

  if (!isPostView(post.reply.parent) || !isPostView(post.reply.root)) {
    return <></>;
  }

  const parentIsRoot = post.reply.parent.cid === post.reply.root.cid;
  const hasEllipsis =
    isPost(post.reply.parent.record) &&
    post.reply.parent.record.reply?.parent.cid !== post.reply.root.cid;

  return (
    <>
      <PostCard postView={post.reply.root} />
      <div className="flex flex-col gap-2 border-l border-highlight pl-4 tablet:gap-4">
        {!parentIsRoot && hasEllipsis && (
          <Link
            to={`/profile/${post.reply.root.author.handle}/post/${post.reply.root.uri.split("/").pop()}`}
            className="flex items-center text-sm text-fg-muted"
          >
            <MoreVertIcon />
            <span>Show thread</span>
          </Link>
        )}
        {!parentIsRoot && <PostCard postView={post.reply.parent} />}
        <PostCard postView={post.post} reason={post.reason} />
      </div>
    </>
  );
}
