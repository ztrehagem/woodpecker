import clsx from "clsx";
import React from "react";

export function GraphemesCounter({ count }: { count: number }): React.ReactElement {
  return <div className={clsx("text-sm", { "text-fg-danger": count > 300 })}>{count} / 300</div>;
}
