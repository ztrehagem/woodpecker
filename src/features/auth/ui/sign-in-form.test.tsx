import { expect, test, vi } from "vitest";
import { render } from "vitest-browser-react";
import SignInForm from "./sign-in-form";

test("renders correctly", async () => {
  const action = vi.fn<() => Promise<void>>();
  const view = await render(<SignInForm action={action} />);

  await expect.element(view.getByLabelText("Handle")).toBeInTheDocument();
});
