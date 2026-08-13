import React from "react";

export default function Card({ children }: React.PropsWithChildren<{}>): React.ReactElement {
  return <div className="w-full overflow-clip rounded-3xl bg-filling">{children}</div>;
}
