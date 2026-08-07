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

This repository is organized around three main layers:

- `src`: frontend application code. The structure inside `src` follows Feature-Sliced Design (FSD); for conventions on layer placement and import rules, see [.agents/skills/feature-sliced-design/SKILL.md](.agents/skills/feature-sliced-design/SKILL.md).
- `worker`: Cloudflare Worker entrypoints and server-side runtime logic.
- `shared`: cross-cutting code reused by both the frontend and the worker, such as utilities, AT Protocol helpers, and shared types.

## Quality Gates

Before opening a PR, run:

```bash
pnpm run lint
pnpm run vitest
pnpm run playwright
```

CI runs the same checks in GitHub Actions.
