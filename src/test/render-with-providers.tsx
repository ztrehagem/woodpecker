import { Toast } from "@base-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { Suspense } from "react";
import { MemoryRouter } from "react-router";
import { render } from "vitest-browser-react";

import type { Session } from "#src/shared/auth/index.ts";
import { AtProtoMockProvider } from "#src/test/atproto-mock-provider.tsx";
import { createMockSession } from "#src/test/atproto-mock.ts";

type RenderWithProvidersOptions = {
  session?: Session | null;
  initialEntries?: string[];
};

export function renderWithProviders(
  ui: ReactNode,
  { session = createMockSession(), initialEntries }: RenderWithProvidersOptions = {},
): ReturnType<typeof render> {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const content = <Suspense>{ui}</Suspense>;
  const routedContent =
    initialEntries == null ? (
      content
    ) : (
      <MemoryRouter initialEntries={initialEntries}>{content}</MemoryRouter>
    );

  return render(
    <QueryClientProvider client={queryClient}>
      <Toast.Provider>
        <AtProtoMockProvider session={session}>{routedContent}</AtProtoMockProvider>
      </Toast.Provider>
    </QueryClientProvider>,
  );
}
