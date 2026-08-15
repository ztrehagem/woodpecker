import clsx from "clsx";
import React from "react";

export default function Card({
  bordered = false,
  children,
}: React.PropsWithChildren<{ bordered?: boolean }>): React.ReactElement {
  return (
    <div
      className={clsx("w-full overflow-clip rounded-3xl bg-filling", {
        "border border-highlight": bordered,
      })}
    >
      {children}
    </div>
  );
}
