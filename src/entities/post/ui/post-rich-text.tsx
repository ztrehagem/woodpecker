import { RichText } from "@atproto/api";
import React from "react";

import type { app } from "#src/shared/api/lexicons/index.ts";

import { RichTextSegmentView } from "./rich-text-segment-view";

export function PostRichText({
  text,
  facets,
}: {
  text: string;
  facets?: app.bsky.richtext.facet.Main[];
}): React.ReactElement | null {
  if (text.length === 0) {
    return null;
  }

  const richText = new RichText({ text, facets });

  return (
    <p className="whitespace-pre-line">
      {Array.from(richText.segments()).map((segment, index) => (
        <RichTextSegmentView key={index} segment={segment} />
      ))}
    </p>
  );
}
