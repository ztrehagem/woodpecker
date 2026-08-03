import { expect, test, vi } from "vitest";
import { render } from "vitest-browser-react";
import SignInForm from "./sign-in-form";

test("renders correctly", async () => {
  const onSubmit = vi.fn<() => Promise<void>>();
  const view = await render(<SignInForm onSubmit={onSubmit} />);

  await expect.element(view.getByLabelText("Handle")).toBeInTheDocument();
});
