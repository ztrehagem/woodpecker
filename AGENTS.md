# AGENTS

This file guides coding agents working in this repository.

## Mission

- Make minimal, safe changes.
- Keep behavior consistent unless explicitly asked to change it.
- Prefer small diffs over broad rewrites.

## Edit Boundaries

- Preserve existing architecture and naming conventions.
- Do not move files or rename public modules unless required.
- Avoid touching unrelated files in the same change.

## Special Rules

- Treat `src/shared/api/lexicons` as generated output.
- For project layout and layer decisions under `src`, consult `.agents/skills/feature-sliced-design/SKILL.md`.
- Keep local callback compatibility with `127.0.0.1` behavior.

## Testing Conventions

- Do not `vi.mock` a `*-query.ts` module (e.g. `useLikesQuery`, `useTimelineQuery`) just to control page/component test data. Instead, render the real hook and spy on the underlying Lexicon call, e.g. `vi.spyOn(session.client, "call").mockResolvedValue(...)`.
- Tests that exercise a real query hook need a `QueryClientProvider` (with `retry: false`) wrapping the component under test.
- Prefer interaction-driven assertions (e.g. clicking "Load more") over injecting pre-fetched multi-page data directly, since pagination is now driven by real `useInfiniteQuery` behavior.

## Validation Checklist

Before finishing, run relevant checks:

```bash
pnpm run oxlint
pnpm run oxfmt
pnpm run depcruise
pnpm run steiger
pnpm run typecheck
pnpm run vitest
pnpm run playwright
```

- When running tests, prefer the VS Code Testing API (for example, the Test Explorer or test runner integration) over invoking `vitest` directly in the terminal whenever possible.
- Use the `vitest` CLI only when the VS Code Testing API cannot cover the required scenario or when a targeted terminal-based command is explicitly needed.
- Prefer to run steiger, vitest, and playwright outside the sandbox. Ask the user if needed.

## Output Expectations

- Summarize what changed and why.
- List commands run and results.
- Call out risks or assumptions if any checks were skipped.
