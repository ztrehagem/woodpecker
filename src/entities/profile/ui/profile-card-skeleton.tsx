import React from "react";

import Card from "#src/shared/ui/card.tsx";

export function ProfileCardSkeleton(): React.ReactElement {
  return (
    <Card>
      <section aria-hidden="true">
        <div className="relative h-48 animate-pulse rounded-t-xl bg-highlight tablet:h-56" />

        <div className="relative px-5 pt-0 pb-6 tablet:px-8">
          <div className="-mt-14 flex flex-wrap items-end gap-4 tablet:-mt-16">
            <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-4 border-filling bg-slate-300 tablet:h-28 tablet:w-28" />

            <div className="flex flex-1 flex-wrap items-start justify-between gap-3 pb-2">
              <div className="w-full space-y-2">
                <div className="h-7 w-36 animate-pulse rounded-full bg-highlight" />
                <div className="h-4 w-24 animate-pulse rounded-full bg-highlight" />
              </div>
            </div>
          </div>

          <div className="mt-5 space-y-2">
            <div className="h-4 w-full animate-pulse rounded-full bg-highlight" />
            <div className="h-4 w-4/5 animate-pulse rounded-full bg-highlight" />
          </div>

          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
            <div className="h-4 w-20 animate-pulse rounded-full bg-highlight" />
            <div className="h-4 w-24 animate-pulse rounded-full bg-highlight" />
            <div className="h-4 w-24 animate-pulse rounded-full bg-highlight" />
          </div>
        </div>
      </section>
    </Card>
  );
}
