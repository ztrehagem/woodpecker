import type { RichTextSegment } from "@atproto/api";
import React from "react";
import { Link } from "react-router";

export function RichTextSegmentView({ segment }: { segment: RichTextSegment }): React.ReactElement {
  switch (true) {
    case segment.isLink():
      return (
        <a href={segment.link?.uri} target="_blank">
          {segment.text}
        </a>
      );
    case segment.isMention():
      return <Link to={`/profile/${segment.mention?.did}`}>{segment.text}</Link>;
    case segment.isTag():
      return <>{segment.text}</>;
    default:
      return <>{segment.text}</>;
  }
}
