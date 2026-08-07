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

- Prefer to run steiger, vitest, and playwright outside the sandbox. Ask the user if needed.

## Output Expectations

- Summarize what changed and why.
- List commands run and results.
- Call out risks or assumptions if any checks were skipped.
