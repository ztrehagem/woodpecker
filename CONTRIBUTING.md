# Contributing

Thanks for contributing to Woodpecker.

## Development Setup

```bash
pnpm install
pnpm run dev
```

Requirements:

see `devEngines` field of [package.json](./package.json).

## Branch and PR Workflow

- Create a feature branch from `main`.
- Keep PRs focused and small when possible.
- Include a short summary of what changed and why.

## Required Checks Before PR

Run locally before opening or updating a PR:

```bash
pnpm run lint
pnpm run test
```

These checks are also enforced in CI.

## Code and Architecture Notes

- Respect the existing FSD-based structure under `src`. `pnpm run steiger --watch` is helpful.
- Avoid unrelated refactors in the same PR.
- If changing auth flow, verify both browser OAuth code and worker metadata endpoint.
- Manage `z-index` values with the `--index-*` CSS variables. Use them for UI that appears
  above other content.
- For UI rendered in a portal, such as Base UI's `*.Portal` components, use
  `--index-overlay`. Keeping portal layers at the same `z-index` allows later elements in
  the DOM to appear on top.

## Generated Files

- These files and directories are generated:
  - /lexicons.json
  - /lexicons/
  - /src/shared/api/lexicons/
- Do not hand-edit generated outputs unless there is a clear reason.
- Regenerate with: `pnpm run prepare`
