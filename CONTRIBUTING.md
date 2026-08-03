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
pnpm run vitest
pnpm run playwright
```

These checks are also enforced in CI.

## Code and Architecture Notes

- Respect the existing FSD-based structure under `src`. `pnpm run steiger --watch` is helpful.
- Avoid unrelated refactors in the same PR.
- If changing auth flow, verify both browser OAuth code and worker metadata endpoint.

## Generated Files

- lexicons.json, files under `lexicons`, and API types under `src/shared/api/lexicons` are generated.
- Do not hand-edit generated outputs unless there is a clear reason.
- Regenerate with:

```bash
# add new lexicon
pnpm run lexicon:install <lexicon name>
# regenerate types
pnpm run lexicon:build
```

See also: https://www.npmjs.com/package/@atproto/lex

## Commit Message Guidance

Use clear, imperative summaries, for example:

- `feat: add callback error state`
- `fix: handle oauth restore edge case`
- `test: cover sign-in validation`
