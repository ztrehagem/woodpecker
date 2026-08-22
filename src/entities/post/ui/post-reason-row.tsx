import React from "react";

export function PostReasonRow({
  icon: Icon,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <div className="mb-2 flex items-center gap-x-1 text-2xs text-fg-muted">
      <Icon className="size-4" />
      <span>{children}</span>
    </div>
  );
}
