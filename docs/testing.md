# Testing — WorldCupIQ AI

> **Automated suite:** `bun run test` runs the Vitest + React Testing Library
> suite (see [`testing_report.md`](./testing_report.md)). CI runs lint,
> typecheck, unit tests with coverage, and build on every push
> (`.github/workflows/ci.yml`).

## Levels

1. **Unit tests** — `bun run test` runs the Vitest suite for stadium data,
   the decision RPC input schema, `cn`, and the presentational components
   (`ConfidenceMeter`, `SectionHeading`, `AgentTraceList`).
2. **Coverage** — `bun run test:coverage` produces a V8 coverage report over
   `src/lib/**` and `src/components/**`.
3. **Type check** — `bunx tsgo` verifies every route, agent and component.
4. **Build** — `bun run build` compiles the SSR bundle and the TanStack
   route tree.
5. **Smoke** — hit `/` and `/api/health` after deploy.
6. **Decision path** — POST a request to the AI Command Center and verify
   the returned decision object has every required field.
7. **Accessibility** — keyboard-only navigation across the sidebar, focus
   rings visible, ARIA labels on icon-only controls, contrast AA.
8. **Security** — no secrets in the bundle, all env access guarded on
   the server, fallback path never leaks stack traces to the client.

## Manual regression checklist

- Landing hero, agent grid, module grid all render.
- Sidebar highlights the active route on every page.
- Dashboard KPI cards, area chart, alerts feed render with no console
  errors.
- AI Command Center submits, shows agent trace, then decision card.
- API Status probe shows each of the five required keys.
- Every route sets a distinct `<title>` and meta description.