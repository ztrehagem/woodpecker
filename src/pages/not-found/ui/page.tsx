import type React from "react";
import { Link } from "react-router";

import { Header } from "#src/widgets/header/index.ts";

export default function Page(): React.ReactElement {
  return (
    <>
      <Header />

      <p>404 Not Found</p>
      <Link to="/">Go back to the home</Link>
    </>
  );
}
