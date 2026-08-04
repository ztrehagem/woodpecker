import type React from "react";

export default function Container({ children }: React.PropsWithChildren): React.ReactElement {
  return (
    <div className="px-4 md:px-8">
      <div className="mx-auto w-full max-w-5xl">{children}</div>
    </div>
  );
}
