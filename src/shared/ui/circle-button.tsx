import clsx from "clsx";
import React from "react";

import { LoadingDotsIcon } from "./icon";

interface Props extends React.HTMLAttributes<HTMLElement> {
  type?: "button" | "submit";
  severity?: "primary" | "destructive";
  processing?: boolean;
  disabled?: boolean;
}

export function CircleButton({
  type = "button",
  severity = "primary",
  processing = false,
  disabled = false,
  children,
  ...props
}: Props): React.ReactElement {
  return (
    <button
      type={type}
      disabled={disabled}
      {...props}
      className={clsx(
        "pointer-events-auto relative size-15 cursor-pointer rounded-full px-2 shadow-md shadow-backdrop/50",
        {
          "bg-link active:bg-link-active": severity === "primary",
          "bg-danger active:bg-danger-active": severity === "destructive",
        },
      )}
    >
      <span className={clsx("flex items-center justify-center gap-2", processing && "invisible")}>
        {children}
      </span>
      {processing && (
        <LoadingDotsIcon className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      )}
    </button>
  );
}
