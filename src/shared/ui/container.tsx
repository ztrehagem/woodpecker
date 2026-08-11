import clsx from "clsx";
import type React from "react";

export default function Container({
  children,
  width = "tablet",
}: React.PropsWithChildren<{
  width?: "tablet" | "mobile";
}>): React.ReactElement {
  return (
    <div className="px-3 tablet:px-8">
      <div
        className={clsx("mx-auto w-full", {
          "max-w-tablet": width === "tablet",
          "max-w-mobile": width === "mobile",
        })}
      >
        {children}
      </div>
    </div>
  );
}
