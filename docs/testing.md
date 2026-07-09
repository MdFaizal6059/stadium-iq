# Testing — WorldCupIQ AI

## Levels

1. **Type check** — `bunx tsgo` verifies every route, agent and component.
2. **Build** — `bun run build` compiles the SSR bundle and the TanStack
   route tree.
3. **Smoke** — hit `/` and `/api/health` after deploy.
4. **Decision path** — POST a request to the AI Command Center and verify
   the returned decision object has every required field.
5. **Accessibility** — keyboard-only navigation across the sidebar, focus
   rings visible, ARIA labels on icon-only controls, contrast AA.
6. **Security** — no secrets in the bundle, all env access guarded on
   the server, fallback path never leaks stack traces to the client.

## Manual regression checklist

- Landing hero, agent grid, module grid all render.
- Sidebar highlights the active route on every page.
- Dashboard KPI cards, area chart, alerts feed render with no console
  errors.
- AI Command Center submits, shows agent trace, then decision card.
- API Status probe shows each of the five required keys.
- Every route sets a distinct `<title>` and meta description.