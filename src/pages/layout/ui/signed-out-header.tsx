import React from "react";
import { Link } from "react-router";

export function SignedOutHeader(): React.ReactElement {
  return (
    <header className="pointer-events-none sticky top-0 left-0 z-10">
      <div className="mx-auto flex h-height-header items-stretch justify-between">
        <h1 className="font-brand text-lg font-medium">
          <Link
            to="/"
            className="pointer-events-auto flex h-full items-center gap-2 rounded-b-xl border-r border-b border-l px-5 text-inherit no-underline backdrop-blur-sm"
          >
            <img src="/favicon.webp" alt="" width="24" height="24" />
            Woodpecker
          </Link>
        </h1>
      </div>
    </header>
  );
}
