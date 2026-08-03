---
name: fsd-layers
description: Feature-Sliced Design layer reference for this repository. Use when deciding where code should live, evaluating imports between layers, or reviewing architecture changes.
---

# FSD Layers Skill

Source reference:

- https://feature-sliced.design/docs/reference/layers

Use this skill when:

- choosing a target layer for new code
- reviewing whether an import direction is valid
- deciding if code belongs in page, feature, entity, or shared
- evaluating whether introducing widgets/entities is justified

## Layer Order and Dependency Direction

Responsibility and dependency flow from top to bottom:

- app
- processes (deprecated; avoid)
- pages
- widgets
- features
- entities
- shared

Import rule:

- A module in a slice can import only from slices on lower layers.
- `app` and `shared` are exceptions and are treated as layers without business slices.
- Avoid adding custom layers.

Practical rule of thumb:

- Allowed: higher layer -> lower layer
- Not allowed: lower layer -> higher layer
- Not allowed by default: cross-slice imports on same layer

## Layer Meanings

### app

- App-wide setup and integration.
- Typical segments: routes, styles, entrypoint, global providers.
- Keep business-specific interactions out unless truly app-level.

### pages

- Route-level screens.
- Can contain page UI, loading/error states, and page-scoped data fetching.
- If a block is not reused, keeping it in a page is fine.

### widgets

- Large self-sufficient UI blocks.
- Prefer only when reused across pages or when a page has multiple large independent blocks.
- Do not create widgets for one-off page-local blocks.

### features

- User-important interactions (sign-in, checkout, comment submit).
- Good indicator: reused across pages or represents a major product capability.
- Not everything should become a feature.

### entities

- Real-world domain concepts (user, post, profile).
- Can include model, api, and ui focused on the entity.
- Cross-entity coupling should usually be orchestrated in higher layers.

### shared

- Foundation layer: external integrations, ui kit, utilities with clear scope, config.
- No business-domain slicing.
- Keep it domain-agnostic where possible.

### processes

- Deprecated in current spec.
- Prefer app/features/pages instead.

## Repository-Specific Guidance

Current `src` layers in this repository:

- `src/app`
- `src/pages`
- `src/features`
- `src/shared`

Optional layers:

- `src/widgets`
- `src/entities`

Only introduce optional layers when:

- there is clear reuse or architecture pressure
- the new layer improves discoverability and boundaries
- steiger/dependency checks remain clean

## Review Checklist

When reviewing a change:

- Is code placed in the lowest layer that still matches its responsibility?
- Are imports flowing strictly downward by layer?
- Is this a true feature/entity/widget, or should it stay in page/shared?
- Is the change introducing cross-slice coupling that should be moved upward?

If uncertain, prefer the simpler placement first:

- page-local code stays in pages
- reusable interaction goes to features
- reusable domain representation goes to entities
- app-wide concerns go to app
