# Woodpecker

AT Protocol client application built with React + Cloudflare Workers.

## Stack

- React 19 + React Router
- Vite
- Cloudflare Workers (Hono)
- TypeScript
- Vitest + Playwright
- Oxlint + Oxfmt + Steiger + Dependency Cruiser

## Quick Start

```bash
pnpm install
pnpm run dev
```

Open `http://127.0.0.1:5173`.

## Scripts

```bash
pnpm run dev          # local dev server
pnpm run build        # type-check + build
pnpm run typecheck    # TypeScript checks
pnpm run lint         # oxlint/oxfmt/depcruise/steiger/typecheck
pnpm run vitest       # unit and component tests
pnpm run playwright   # e2e tests
pnpm run deploy       # manual deploy (not regular use)
```

## OAuth Notes

- Local development uses `127.0.0.1` so OAuth callback works as expected.
- Production uses `atp-client-metadata.json` served by the Worker.

## Project Layout

Following [Feature-Sliced Design (FSD)](https://feature-sliced.design/) and file/directory structure is checked by Steiger.

Current layers in this repository:

- `src/app`: app entrypoint and router
- `src/pages`: route-level pages
- `src/widgets`: reusable, self-contained UI blocks
- `src/features`: main interactions that users care to do
- `src/entities`: domain concepts and related model/ui
- `src/shared`: a foundation for the rest of the app
- `worker`: Cloudflare Worker

## Quality Gates

Before opening a PR, run:

```bash
pnpm run lint
pnpm run vitest
pnpm run playwright
```

CI runs the same checks in GitHub Actions.
