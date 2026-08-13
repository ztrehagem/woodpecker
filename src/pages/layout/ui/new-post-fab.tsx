import React from "react";

import { NewPostDialog } from "#src/entities/post/index.ts";
import { CircleButton } from "#src/shared/ui/circle-button.tsx";
import { EditSquareIcon } from "#src/shared/ui/icon/index.ts";

export function NewPostFab(): React.ReactElement {
  return (
    <NewPostDialog.Trigger
      render={(props) => (
        <div className="pointer-events-none sticky inset-x-0 bottom-16 z-10 tablet:bottom-4">
          <div className="flex justify-end">
            <CircleButton {...props} />
          </div>
        </div>
      )}
    >
      <EditSquareIcon aria-label="New post" />
    </NewPostDialog.Trigger>
  );
}
