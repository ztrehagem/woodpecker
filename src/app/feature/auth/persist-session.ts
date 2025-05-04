import type { AtpSessionData, AtpSessionEvent } from "@atproto/api";

import { hc } from "../../hc";

export function persistSession(
  service: URL,
): (event: AtpSessionEvent, session: AtpSessionData | undefined) => void {
  return (event, session) => {
    switch (event) {
      case "create":
      case "update":
        if (session) {
          hc.atpSession
            .$put({
              json: { ...session, service: service.toString() },
            })
            .catch(() => {
              // ignore
            });
        }
        return;
      case "create-failed":
      case "expired":
      case "network-error":
        return;
    }
  };
}
