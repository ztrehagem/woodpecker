import type React from "react";

export default function Container({ children }: React.PropsWithChildren): React.ReactElement {
  return (
    <div className="px-4 tablet:px-8">
      <div className="mx-auto w-full max-w-tablet">{children}</div>
    </div>
  );
}
