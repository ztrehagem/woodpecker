import React from "react";

import { LoadingBoxesIcon } from "#src/shared/ui/icon/index.ts";

export default function LoadingFallback(): React.ReactElement {
  return (
    <div className="grid grow grid-cols-1 grid-rows-1 place-items-center px-5 py-4">
      <LoadingBoxesIcon />
    </div>
  );
}
