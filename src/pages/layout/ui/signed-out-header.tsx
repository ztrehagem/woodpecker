import React from "react";
import { Link } from "react-router";

export function SignedOutHeader(): React.ReactElement {
  return (
    <header className="pointer-events-none sticky top-0 left-0 z-10 tablet:px-8">
      <div className="mx-auto flex h-15 items-stretch justify-between tablet:max-w-tablet">
        <h1 className="font-brand text-lg font-medium">
          <Link
            to="/"
            className="pointer-events-auto flex h-full items-center gap-2 rounded-br-xl border-r border-b px-5 text-inherit no-underline backdrop-blur-sm tablet:rounded-b-xl tablet:border-l"
          >
            <img src="/favicon.webp" alt="" width="24" height="24" />
            Woodpecker
          </Link>
        </h1>
      </div>
    </header>
  );
}
