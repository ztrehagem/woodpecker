import React from "react";

export default function Card({ children }: React.PropsWithChildren<{}>): React.ReactElement {
  return <div className="bg-filling w-full overflow-hidden rounded-3xl shadow-2xl">{children}</div>;
}
