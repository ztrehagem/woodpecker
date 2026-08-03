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
- For project layout and layer decisions, consult `.copilot/skills/fsd-layers/SKILL.md`.
- For OAuth-related changes, validate both:
  - Browser OAuth client behavior
  - Worker endpoint for `atp-client-metadata.json`
- Keep local callback compatibility with `127.0.0.1` behavior.

## Validation Checklist

Before finishing, run relevant checks:

```bash
pnpm run lint
pnpm run vitest
pnpm run playwright
```

## Output Expectations

- Summarize what changed and why.
- List commands run and results.
- Call out risks or assumptions if any checks were skipped.
