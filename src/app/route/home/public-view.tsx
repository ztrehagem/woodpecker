import type React from "react";
import { Link } from "react-router";

export default function PublicView(): React.ReactElement {
  return (
    <div>
      <h1>Project Woodpecker</h1>
      <Link to={"/login"}>Login</Link>
    </div>
  );
}
