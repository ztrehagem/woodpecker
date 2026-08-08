import type React from "react";
import { Link } from "react-router";

import Container from "#src/shared/ui/container.tsx";

export default function Page(): React.ReactElement {
  return (
    <div className="grid grow grid-cols-1 grid-rows-1 place-items-center px-5 py-4">
      <Container>
        <div className="text-center">
          <p>Not Found</p>
          <Link to="/">Go back to the home</Link>
        </div>
      </Container>
    </div>
  );
}
