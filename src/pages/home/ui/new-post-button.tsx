import { useQuery } from "@tanstack/react-query";
import React from "react";

import { profileQuery } from "#src/entities/profile/index.ts";
import { useAssertSession } from "#src/shared/auth/index.ts";
import Card from "#src/shared/ui/card.tsx";
import { EditSquareIcon } from "#src/shared/ui/icon/index.ts";

import { NewPostDialog } from "./new-post-dialog";

export function NewPostButton(): React.ReactElement {
  const session = useAssertSession();
  const { data: profile } = useQuery(profileQuery(session, session.did));

  return (
    <Card>
      <div className="flex items-center gap-4 px-5 py-4">
        {profile ? (
          <img
            src={profile.avatar}
            alt={profile.displayName}
            width="40"
            height="40"
            className="rounded-full"
          />
        ) : (
          <div className="h-10 w-10 rounded-full bg-highlight" />
        )}

        <NewPostDialog
          trigger={
            <NewPostDialog.Trigger
              className="flex h-10 cursor-pointer items-center justify-center gap-2 font-bold text-link active:text-link-active"
              render={(props) => <button type="button" {...props} />}
            >
              <EditSquareIcon />
              <span>New post</span>
            </NewPostDialog.Trigger>
          }
        />
      </div>
    </Card>
  );
}
