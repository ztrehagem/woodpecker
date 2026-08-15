import { RichText } from "@atproto/api";
import { useMemo } from "react";

export function useGraphemesCount(text: string): number {
  return useMemo(() => {
    const rt = new RichText({ text });
    return rt.graphemeLength;
  }, [text]);
}
