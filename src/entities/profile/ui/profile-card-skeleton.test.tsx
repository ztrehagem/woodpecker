import { expect, test } from "vitest";
import { render } from "vitest-browser-react";

import { ProfileCardSkeleton } from "./profile-card-skeleton";

test("renders a profile loading skeleton", async () => {
  const view = await render(<ProfileCardSkeleton />);

  await expect.element(view.getByRole("status")).toBeInTheDocument();
});
