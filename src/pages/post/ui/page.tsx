import React, { useEffect, useRef } from "react";
import { useParams } from "react-router";

import { DetailedPostCard, PostCard } from "#src/entities/post/index.ts";
import { usePostQuery, type Thread, type ThreadViewPost } from "#src/entities/post/index.ts";
import { useAssertSession } from "#src/shared/auth/index.ts";
import Container from "#src/shared/ui/container.tsx";
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

  return (
    <div className="py-4">
      <Container>{content}</Container>
    </div>
  );
}

function Content({ thread }: { thread: Thread }): React.ReactElement {
  switch (thread.$type) {
    case "app.bsky.feed.defs#threadViewPost": {
      const { post, replies, parent } = thread as ThreadViewPost;

      return (
        <div>
          <Parent parent={parent} />
          <ScrollIntoViewOnMount>
            <DetailedPostCard post={post} />
          </ScrollIntoViewOnMount>
          <Replies replies={replies} />
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

type ParentNode = NonNullable<ThreadViewPost["parent"]>;

function Parent({ parent }: { parent: ParentNode | undefined }): React.ReactElement | null {
  if (parent == null) {
    return null;
  }

  switch (parent.$type) {
    case "app.bsky.feed.defs#threadViewPost": {
      const { post, parent: grandparent } = parent as ThreadViewPost;

      return (
        <div className="mb-4 flex flex-col">
          <Parent parent={grandparent} />
          <PostCard post={post} />
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
          <pre className="text-2xs">{JSON.stringify(parent, null, 2)}</pre>
        </div>
      );
  }
}

type ReplyNode = NonNullable<ThreadViewPost["replies"]>[number];

function Replies({ replies }: { replies: ReplyNode[] | undefined }): React.ReactElement | null {
  if (replies == null || replies.length === 0) {
    return null;
  }

  return (
    <ul className="mt-4 flex flex-col gap-4 border-l border-highlight pl-4">
      {replies.map((reply, index) => (
        <li key={index}>
          <ReplyItem reply={reply} />
        </li>
      ))}
    </ul>
  );
}

function ReplyItem({ reply }: { reply: ReplyNode }): React.ReactElement {
  switch (reply.$type) {
    case "app.bsky.feed.defs#threadViewPost": {
      const { post, replies } = reply as ThreadViewPost;

      return (
        <div>
          <PostCard post={post} />
          <Replies replies={replies} />
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
