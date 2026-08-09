import React from "react";
import { useParams } from "react-router";

import { PostCard } from "#src/entities/post/@x/timeline.ts";
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
    content = <PostView post={data.thread} />;
  }

  return <Container>{content}</Container>;
}

function PostView({ post }: { post: Thread }): React.ReactElement {
  switch (post.$type) {
    case "app.bsky.feed.defs#threadViewPost":
      return (
        <div>
          <PostCard post={(post as ThreadViewPost).post} />
          <pre className="text-2xs">{JSON.stringify(post, null, 2)}</pre>
        </div>
      );
    case "app.bsky.feed.defs#notFoundPost":
      return <div>Post not found</div>;
    case "app.bsky.feed.defs#blockedPost":
      return <div>Post is blocked</div>;
    default:
      return (
        <div>
          <p>Unknown post type</p>
          <pre className="text-2xs">{JSON.stringify(post, null, 2)}</pre>
        </div>
      );
  }
}
