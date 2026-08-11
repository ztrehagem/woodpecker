import { queryOptions, useQuery, type UseQueryResult } from "@tanstack/react-query";

const externalEmbedQueryKeys = {
  all: ["external-embed"] as const,
  detail: (url: string) => [...externalEmbedQueryKeys.all, url] as const,
};

type UriString = `${string}:${string}`;

interface ExternalEmbedPreview {
  uri: UriString;
  title: string;
  description: string;
  thumb: UriString | undefined;
}

function externalEmbedQuery(url: string) {
  return queryOptions({
    queryKey: externalEmbedQueryKeys.detail(url),
    queryFn: async ({ signal }): Promise<ExternalEmbedPreview> => {
      const endpoint = new URL("https://cardyb.bsky.app/v1/extract");
      endpoint.searchParams.set("url", url);

      const res = await fetch(endpoint, { signal });

      if (!res.ok) {
        throw new Error(`Failed to fetch link preview (${res.status})`);
      }

      const body = (await res.json()) as {
        error?: string;
        url?: string;
        title?: string;
        description?: string;
        image?: string;
      };

      if (body.error != null && body.error !== "") {
        throw new Error(body.error);
      }

      const thumb = body.image != null && body.image !== "" ? (body.image as UriString) : void 0;

      return {
        uri: (body.url ?? url) as UriString,
        title: body.title ?? url,
        description: body.description ?? "",
        thumb,
      };
    },
    enabled: url.length > 0,
    staleTime: Infinity,
    retry: false,
  });
}

export function useExternalEmbedQuery(url: string | null): UseQueryResult<ExternalEmbedPreview> {
  return useQuery(externalEmbedQuery(url ?? ""));
}
