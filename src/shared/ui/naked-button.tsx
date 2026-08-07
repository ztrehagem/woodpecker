import clsx from "clsx";
import React from "react";

import { LoadingDotsIcon } from "./icon";

interface Props extends React.HTMLAttributes<HTMLElement> {
  severity?: "primary" | "plain" | "destructive";
  emphasize?: boolean;
  processing?: boolean;
  disabled?: boolean;
}

export function NakedButton({
  severity = "primary",
  emphasize = false,
  processing = false,
  disabled = false,
  children,
  ...props
}: Props): React.ReactElement {
  return (
    <button
      type="button"
      disabled={disabled}
      {...props}
      className={clsx("relative h-8 cursor-pointer px-2", {
        "font-bold": emphasize,
        "text-link active:text-link-active": severity === "primary",
        "text-danger active:text-danger-active": severity === "destructive",
      })}
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
