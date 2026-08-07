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

## OAuth Notes

- Local development uses `127.0.0.1` so OAuth callback works as expected.
- Production uses `atp-client-metadata.json` served by the Worker.

## Project Layout

This repository is organized around three main layers:

- `src`: frontend application code. The structure inside `src` follows Feature-Sliced Design (FSD); for conventions on layer placement and import rules, see [.agents/skills/feature-sliced-design/SKILL.md](.agents/skills/feature-sliced-design/SKILL.md).
- `worker`: Cloudflare Worker entrypoints and server-side runtime logic.
- `shared`: cross-cutting code reused by both the frontend and the worker, such as utilities, AT Protocol helpers, and shared types.
