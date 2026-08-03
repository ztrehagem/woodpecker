import type React from "react";
import { Link } from "react-router";

export default function Page(): React.ReactElement {
  return (
    <>
      <h1>Woodpecker</h1>
      <p>404 Not Found</p>
      <Link to="/">Go back to the home</Link>
    </>
  );
}
