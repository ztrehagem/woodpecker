import { useCallback } from "react";

export type Login = (params: {
  // readonly service: string;
  readonly identifier: string;
  // readonly password: string;
}) => Promise<"invalid_service" | "authentication_failure" | null>;

/** @public */
export function useLogin(): Login {
  return useCallback(async ({ identifier }) => {
    return null;
  }, []);
}

function safeParseURL(urlString: string): URL | null {
  try {
    return new URL(urlString);
  } catch {
    return null;
  }
}
