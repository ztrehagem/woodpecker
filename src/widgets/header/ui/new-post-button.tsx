import React from "react";

import { EditSquareIcon } from "#src/shared/ui/icon/index.ts";

export default function NewPostButton(): React.ReactElement {
  return (
    <button type="button" className="flex size-10 cursor-pointer items-center justify-center">
      <EditSquareIcon className="" />
    </button>
  );
}
