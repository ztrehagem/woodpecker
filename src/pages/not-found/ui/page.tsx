import type React from "react";
import { Link } from "react-router";

export default function Page(): React.ReactElement {
  return (
    <div className="grid grow grid-cols-1 grid-rows-1 place-items-center px-5 py-4">
      <div className="text-center">
        <p>Not Found</p>
        <Link to="/">Go back to the home</Link>
      </div>
    </div>
  );
}
