import { RichText } from "@atproto/api";
import { useEffect, useMemo, useState } from "react";

import { useExternalEmbedQuery } from "../../api/external-embed-query";
import type { ExternalEmbedPreview as ExternalEmbedPreviewComponent } from "./external-embed-preview";

export type Props = React.ComponentProps<typeof ExternalEmbedPreviewComponent>;

export function useExternalEmbedPreview(text: string): Props {
  const debouncedText = useDebouncedValue(text, 400);
  const firstEmbedLink = useMemo(() => getFirstEmbedLink(debouncedText), [debouncedText]);

  const { data: preview, isLoading } = useExternalEmbedQuery(firstEmbedLink?.toString() ?? null);

  return { firstEmbedLink, isLoading, preview };
}

function useDebouncedValue<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

function getFirstEmbedLink(text: string): URL | null {
  const rt = new RichText({ text });
  rt.detectFacetsWithoutResolution();

  for (const segment of rt.segments()) {
    if (segment.isLink()) {
      try {
        return new URL(segment.link?.uri ?? "");
      } catch {
        //
      }
    }
  }

  return null;
}
