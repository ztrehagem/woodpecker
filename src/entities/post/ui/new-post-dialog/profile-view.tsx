import React from "react";

import { useProfileQuery } from "#src/entities/profile/index.ts";
import { useAssertSession } from "#src/shared/auth/index.ts";

export function ProfileView(): React.ReactElement {
  const session = useAssertSession();
  const { data: profile } = useProfileQuery(session, session.did);

  return (
    <div className="flex items-center gap-2">
      <img src={profile?.avatar} alt="" className="size-6 rounded-full" />

      <div className="flex flex-wrap gap-x-2">
        <div className="text-xs font-bold">{profile?.displayName}</div>
        <div className="text-xs text-fg-muted">@{profile?.handle}</div>
      </div>
    </div>
  );
}
