# Testing report

WorldCupIQ AI ships with a Vitest + React Testing Library suite that runs on
every push via GitHub Actions (`.github/workflows/ci.yml`).

## Suite snapshot

| Layer                 | File                                    | What it proves                                           |
| --------------------- | --------------------------------------- | -------------------------------------------------------- |
| Domain data           | `src/lib/stadiums.test.ts`              | All 16 FIFA 2026 host stadiums, country split, ids, geo. |
| Domain data           | `src/lib/stadiums.test.ts`              | Deterministic live-metrics and lat/lng projection.       |
| RPC input validation  | `src/lib/decision-shape.test.ts`        | Zod schema, persona enum, Gemini model allowlist.        |
| UI utility            | `src/lib/utils.test.ts`                 | `cn` join / falsy skip / tailwind conflict merge.        |
| Component (a11y)      | `src/components/confidence-meter.test.tsx` | `progressbar` ARIA + value clamping.                  |
| Component             | `src/components/section-heading.test.tsx` | Heading + optional eyebrow + description.              |
| Component             | `src/components/agent-trace.test.tsx`   | Agent list renders name / notes / latency per agent.     |

## Commands

```bash
bun run test            # run once
bun run test:watch      # watch mode
bun run test:coverage   # V8 coverage, prints text + writes HTML
```

Coverage focuses on the pure/business layer (`src/lib/**`) and presentational
components (`src/components/**`). Server-only modules (`*.server.ts`,
`*.functions.ts`) are excluded from coverage because they call the AI gateway
and are exercised end-to-end via `/api/health` and `/command`.

## Manual regression checklist

See [`docs/testing.md`](./testing.md) for the manual regression checklist
covering the AI Command Center, API status probe, sidebar navigation and
per-route metadata.