import clsx from "clsx";
import React from "react";

import { LoadingDotsIcon } from "./icon";

interface Props extends React.HTMLAttributes<HTMLElement> {
  type?: "button" | "submit";
  severity?: "primary" | "plain" | "destructive";
  emphasize?: boolean;
  processing?: boolean;
  disabled?: boolean;
}

export function NakedButton({
  type = "button",
  severity = "primary",
  emphasize = false,
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
      className={clsx("pointer-events-auto relative h-8 cursor-pointer px-2", {
        "font-bold": emphasize,
        "text-fg-link active:text-fg-link-active": severity === "primary",
        "text-fg-danger active:text-fg-danger-active": severity === "destructive",
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
