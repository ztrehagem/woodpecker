import React, { useEffect, useRef } from "react";
import { useParams } from "react-router";

import { DetailedPostCard, PostCard } from "#src/entities/post/index.ts";
import { usePostQuery } from "#src/entities/post/index.ts";
import type { app } from "#src/shared/api/lexicons/index.ts";
import { useAssertSession } from "#src/shared/auth/index.ts";
import LoadingFallback from "#src/shared/ui/loading-fallback.tsx";

export function Page(): React.ReactElement {
  const { handle, postId } = useParams<{ handle: string; postId: string }>();
  const uri = `at://${handle}/app.bsky.feed.post/${postId}` as const;
  const session = useAssertSession();
  const { data, error, isPending } = usePostQuery(session, uri);

  let content = null;

  if (error) {
    content = <div>{error.message}</div>;
  } else if (isPending || data == null) {
    content = <LoadingFallback />;
  } else {
    content = <Content thread={data.thread} />;
  }

  return <div className="py-2 tablet:py-4">{content}</div>;
}

function Content({
  thread,
}: {
  thread: app.bsky.feed.getPostThread.$Output["body"]["thread"];
}): React.ReactElement {
  switch (thread.$type) {
    case "app.bsky.feed.defs#threadViewPost": {
      const { post, replies, parent } = thread as app.bsky.feed.defs.ThreadViewPost;

      return (
        <div>
          <ParentCardList parent={parent} />
          <ScrollIntoViewOnMount>
            <DetailedPostCard postView={post} />
          </ScrollIntoViewOnMount>
          <ReplyCardList replies={replies} />
        </div>
      );
    }
    case "app.bsky.feed.defs#notFoundPost":
      return <div>Post not found</div>;
    case "app.bsky.feed.defs#blockedPost":
      return <div>Post is blocked</div>;
    default:
      return (
        <div>
          <p>Unknown post type</p>
          <pre className="text-2xs">{JSON.stringify(thread, null, 2)}</pre>
        </div>
      );
  }
}

function ScrollIntoViewOnMount({ children }: { children: React.ReactNode }): React.ReactElement {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollIntoView();
    }
  }, []);

  return (
    <div ref={ref} className="scroll-mt-15">
      {children}
    </div>
  );
}

type ParentView = NonNullable<app.bsky.feed.defs.ThreadViewPost["parent"]>;

function ParentCardList({ parent }: { parent: ParentView | undefined }): React.ReactElement | null {
  if (parent == null) {
    return null;
  }

  switch (parent.$type) {
    case "app.bsky.feed.defs#threadViewPost": {
      const { post, parent: grandparent } = parent as app.bsky.feed.defs.ThreadViewPost;

      return (
        <div className="mb-2 flex flex-col tablet:mb-4">
          <ParentCardList parent={grandparent} />
          <PostCard postView={post} />
        </div>
      );
    }
    case "app.bsky.feed.defs#notFoundPost":
      return <></>;
    case "app.bsky.feed.defs#blockedPost":
      return <></>;
    default:
      return (
        <div>
          <p>Unknown post type</p>
          {import.meta.env.DEV && (
            <pre className="text-2xs text-fg-muted">{JSON.stringify(parent, null, 2)}</pre>
          )}
        </div>
      );
  }
}

type ReplyView = NonNullable<app.bsky.feed.defs.ThreadViewPost["replies"]>[number];

function ReplyCardList({
  replies,
}: {
  replies: ReplyView[] | undefined;
}): React.ReactElement | null {
  if (replies == null || replies.length === 0) {
    return null;
  }

  return (
    <ul className="mt-2 flex flex-col gap-2 border-l border-highlight pl-4 tablet:mt-4 tablet:gap-4">
      {replies.map((reply, index) => (
        <li key={index}>
          <ReplyCardListItem reply={reply} />
        </li>
      ))}
    </ul>
  );
}

function ReplyCardListItem({ reply }: { reply: ReplyView }): React.ReactElement {
  switch (reply.$type) {
    case "app.bsky.feed.defs#threadViewPost": {
      const { post, replies } = reply as app.bsky.feed.defs.ThreadViewPost;

      return (
        <div>
          <PostCard postView={post} />
          <ReplyCardList replies={replies} />
        </div>
      );
    }
    case "app.bsky.feed.defs#notFoundPost":
      return <div>Post not found</div>;
    case "app.bsky.feed.defs#blockedPost":
      return <div>Post is blocked</div>;
    default:
      return (
        <div>
          <p>Unknown post type</p>
          <pre className="text-2xs">{JSON.stringify(reply, null, 2)}</pre>
        </div>
      );
  }
}
