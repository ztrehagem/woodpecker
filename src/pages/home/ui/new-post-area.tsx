import React from "react";
import { Link } from "react-router";

import { NewPostDialog } from "#src/entities/post/index.ts";
import { useProfileQuery } from "#src/entities/profile/index.ts";
import { useAssertSession } from "#src/shared/auth/index.ts";
import Card from "#src/shared/ui/card.tsx";
import { EditSquareIcon } from "#src/shared/ui/icon/index.ts";
import { NakedButton } from "#src/shared/ui/naked-button.tsx";

export function NewPostArea(): React.ReactElement {
  const session = useAssertSession();
  const { data: profile } = useProfileQuery(session, session.did);

  return (
    <Card>
      <div className="flex items-center gap-4 p-3 tablet:px-5 tablet:py-4">
        {profile ? (
          <Link to={`/profile/${profile.handle}`} className="shrink-0">
            <img
              src={profile.avatar}
              alt={profile.displayName}
              width="40"
              height="40"
              className="rounded-full"
            />
          </Link>
        ) : (
          <div className="h-10 w-10 rounded-full bg-highlight" />
        )}

        <NewPostDialog
          trigger={
            <NewPostDialog.Trigger render={(props) => <NakedButton emphasize {...props} />}>
              <EditSquareIcon />
              <span>New post</span>
            </NewPostDialog.Trigger>
          }
        />
      </div>
    </Card>
  );
}
