import type React from "react";
import { expect, test, vi } from "vitest";
import { render } from "vitest-browser-react";

import SignInForm from "./sign-in-form";

test("表示できる", async () => {
  const action = vi.fn<React.ComponentProps<typeof SignInForm>["action"]>();
  const view = await render(<SignInForm action={action} />);

  await expect.element(view.getByLabelText("Handle")).toBeInTheDocument();
});

test("ハンドルの前後空白を除去して action に渡す", async () => {
  const action = vi.fn<React.ComponentProps<typeof SignInForm>["action"]>();
  const view = await render(<SignInForm action={action} />);

  await view.getByLabelText("Handle").fill("  alice.bsky.social  ");
  await view.getByRole("button", { name: "Login" }).click();

  expect(action).toHaveBeenCalledTimes(1);
  expect(action).toHaveBeenCalledWith({ handle: "alice.bsky.social" });
});

test("フォーム送信時に action が 1 回だけ呼ばれる", async () => {
  const action = vi.fn<React.ComponentProps<typeof SignInForm>["action"]>();
  const view = await render(<SignInForm action={action} />);

  await view.getByLabelText("Handle").fill("alice");
  await view.getByRole("button", { name: "Login" }).click();

  expect(action).toHaveBeenCalledTimes(1);
});

test("action が Error を投げたときにエラーメッセージを表示する", async () => {
  const action = vi.fn<React.ComponentProps<typeof SignInForm>["action"]>(async (_params) => {
    throw new Error("invalid handle");
  });
  const view = await render(<SignInForm action={action} />);

  await view.getByLabelText("Handle").fill("alice");
  await view.getByRole("button", { name: "Login" }).click();

  await expect.element(view.getByText("invalid handle")).toBeInTheDocument();
});

test("action が Error 以外を投げたときに Unknown error を表示する", async () => {
  const action = vi.fn<React.ComponentProps<typeof SignInForm>["action"]>(async (_params) => {
    throw "boom";
  });
  const view = await render(<SignInForm action={action} />);

  await view.getByLabelText("Handle").fill("alice");
  await view.getByRole("button", { name: "Login" }).click();

  await expect.element(view.getByText("Unknown error")).toBeInTheDocument();
});

test("送信成功時に表示中のエラーメッセージがクリアされる", async () => {
  const action = vi.fn<React.ComponentProps<typeof SignInForm>["action"]>(async ({ handle }) => {
    if (handle === "bad") {
      throw new Error("invalid handle");
    }
  });
  const view = await render(<SignInForm action={action} />);

  await view.getByLabelText("Handle").fill("bad");
  await view.getByRole("button", { name: "Login" }).click();
  await expect.element(view.getByText("invalid handle")).toBeInTheDocument();

  await view.getByLabelText("Handle").fill("good");
  await view.getByRole("button", { name: "Login" }).click();

  await expect.element(view.getByText("invalid handle")).not.toBeInTheDocument();
});

test("送信中はログインボタンが disabled になる", async () => {
  let resolvePromise: () => void = () => {};
  const pendingAction = new Promise<void>((resolve) => {
    resolvePromise = resolve;
  });
  const action = vi.fn<React.ComponentProps<typeof SignInForm>["action"]>(
    async (_params) => pendingAction,
  );
  const view = await render(<SignInForm action={action} />);

  await view.getByLabelText("Handle").fill("alice");
  await view.getByRole("button", { name: "Login" }).click();

  await expect.element(view.getByRole("button")).toBeDisabled();

  resolvePromise();
});

test("ハンドル入力欄に required と username の autoComplete が設定されている", async () => {
  const action = vi.fn<React.ComponentProps<typeof SignInForm>["action"]>();
  const view = await render(<SignInForm action={action} />);
  const input = view.getByLabelText("Handle");

  await expect.element(input).toHaveAttribute("required");
  await expect.element(input).toHaveAttribute("autocomplete", "username");
});

test("フォームに noValidate が設定されている", async () => {
  const action = vi.fn<React.ComponentProps<typeof SignInForm>["action"]>();
  const view = await render(<SignInForm action={action} />);
  const form = view.container.querySelector("form");

  expect(form).not.toBeNull();
  expect(form?.hasAttribute("novalidate")).toBe(true);
});
