import { afterEach, describe, expect, test, vi } from "vitest";

import type { Session } from "#src/shared/auth/index.ts";
import { createMockSession } from "#src/test/atproto-mock.ts";
import { renderWithProviders } from "#src/test/render-with-providers.tsx";

import Page from "./page";

const navigate = vi.fn<(to: string, options?: { replace: boolean }) => void>();

vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return {
    ...actual,
    useNavigate: () => navigate,
  };
});

function renderPage(session: Session | null) {
  return renderWithProviders(<Page />, { session, initialEntries: ["/"] });
}

afterEach(() => {
  navigate.mockClear();
});

describe("認証済み時", () => {
  test("ホームページへの自動リダイレクトが実行される", async () => {
    const session = createMockSession("did:plc:test");

    await renderPage(session);

    expect(vi.mocked(navigate)).toHaveBeenCalledWith("/", { replace: true });
  });
});

describe("未認証時", () => {
  test("エラーメッセージとリンクが表示される", async () => {
    const view = await renderPage(null);

    await expect.element(view.getByText("Failed to login")).toBeInTheDocument();
    const link = view.getByText("Go back to home");
    await expect.element(link).toBeInTheDocument();
    await expect.element(link).toHaveRole("link");
  });
});
