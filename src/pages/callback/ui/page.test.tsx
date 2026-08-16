import { Suspense } from "react";
import { MemoryRouter } from "react-router";
import { afterEach, describe, expect, test, vi } from "vitest";
import { render } from "vitest-browser-react";

import type { Session } from "#src/shared/auth/index.ts";
import { AtProtoMockProvider } from "#src/test/atproto-mock-provider.tsx";
import { createMockSession } from "#src/test/atproto-mock.ts";

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
  return render(
    <MemoryRouter>
      <AtProtoMockProvider session={session}>
        <Suspense>
          <Page />
        </Suspense>
      </AtProtoMockProvider>
    </MemoryRouter>,
  );
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
