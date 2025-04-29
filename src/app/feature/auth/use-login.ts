import { AtpAgent } from "@atproto/api";
import { useCallback, useContext } from "react";

import { SetAtpAgentContext } from "./context";

export type Login = (params: {
  readonly service: string;
  readonly identifier: string;
  readonly password: string;
}) => Promise<"invalid_service" | "authentication_failure" | null>;

/** @public */
export function useLogin(): Login {
  const setAuthenticated = useContext(SetAtpAgentContext);

  return useCallback(
    async ({ service, identifier, password }) => {
      const serviceUrl = safeParseURL(service || "https://bsky.social");

      if (serviceUrl == null) {
        return "invalid_service";
      }

      const agent = new AtpAgent({
        service: serviceUrl,
        // TODO: persistSession
      });

      const result = await agent.sessionManager.login({
        identifier,
        password,
      });

      if (!result.success) {
        return "authentication_failure";
      }

      setAuthenticated(agent);
      return null;
    },
    [setAuthenticated],
  );
}

function safeParseURL(urlString: string): URL | null {
  try {
    return new URL(urlString);
  } catch {
    return null;
  }
}
