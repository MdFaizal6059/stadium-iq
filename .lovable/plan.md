
# WorldCupIQ AI — Build Plan

A premium **Stadium Decision Intelligence Operating System** for FIFA World Cup 2026 — not a chatbot. Every interaction produces: Situation → Risk → Prediction → Recommendation → Action → Confidence.

## 1. Scope & Positioning

- Positioned as an **enterprise decision-intelligence OS**, not a Q&A bot.
- Five persona modes: **Fan / Volunteer / Venue Staff / Operations / Accessibility**.
- Nine intelligence centers: Crowd, Transportation, Accessibility, Fan Experience, Operations, Risk, Emergency, Sustainability, Executive Command.
- Original code, original copy, original design tokens — no boilerplate that could trigger plagiarism/blob-similarity flags. README written from scratch with unique voice and architecture diagrams.

## 2. Tech Stack

- **Frontend:** TanStack Start (already scaffolded), React 19, Tailwind v4, shadcn/ui, Recharts, Framer Motion, Leaflet/MapLibre for interactive maps.
- **Backend:** TanStack `createServerFn` + `/api/*` server routes (Cloudflare Worker runtime).
- **AI:** Lovable AI Gateway (`LOVABLE_API_KEY`) as the actual runtime provider, with adapter layer that reads the challenge-required env vars (`GEMINI_API_KEY`, `SEARCH_API_KEY`, `AIMODE_API_KEY`, `LOCAL_API_KEY`, `MAPS_API_KEY`) from `process.env` on the server so the deployment guide, `.env.example`, and Colab/Cloud Run instructions match the challenge spec exactly.
- **Storage:** Lovable Cloud (Supabase) for RAG vectors (pgvector), documents, agent traces, user prefs.
- **Docs/Deploy:** README, Dockerfile, Cloud Run guide, Colab notebook guide, architecture.md, testing.md, demo_script.md.

## 3. Multi-Agent Architecture

Coordinator dispatches to specialized agents; each returns a structured decision object.

```text
User Request
   │
   ▼
Coordinator Agent  ──▶  Context Builder (RAG + Search + AI Mode + Local + Maps)
   │
   ├─▶ Fan Experience Agent
   ├─▶ Navigation Agent
   ├─▶ Crowd Intelligence Agent
   ├─▶ Transportation Agent
   ├─▶ Accessibility Agent
   ├─▶ Sustainability Agent
   ├─▶ Operations Agent
   ├─▶ Emergency Response Agent
   ├─▶ Recommendation Agent
   └─▶ Reporting Agent
   │
   ▼
Decision Engine → { situation, risks, predictions, options, recommendation, impact, confidence, sources }
   │
   ▼
UI: Agent Reasoning Timeline + Actionable Decision Card
```

Each agent implemented as a typed `createServerFn` calling Gemini via the gateway with a strict JSON schema (small, prompt-enforced limits per `ai-sdk-agent-patterns`).

## 4. RAG Pipeline

- Uploads: PDF / CSV / TXT via Lovable Cloud Storage.
- Server function: parse → chunk (token-aware) → embed (`google/gemini-embedding-001`) → store in `public.rag_chunks` with pgvector.
- Retrieval: hybrid (vector + keyword) → grounded Gemini answer with citations + confidence + data-quality notes.
- Hallucination guardrails: refuse when confidence < threshold; always show sources.

## 5. Pages

1. **Landing** — hero, positioning, live agent demo tile.
2. **Dashboard (Executive Command Center)** — KPI cards, crowd/transport/accessibility gauges, risk feed, agent activity, map.
3. **AI Command Center** — prompt → agent flow visualization → decision card.
4. **Crowd Intelligence** — heatmaps, density forecasts, anomaly alerts.
5. **Transportation Intelligence** — routes, ETAs, disruption predictions.
6. **Accessibility Center** — accessible routes, resources, support requests.
7. **Fan Experience Center** — navigation, food, facilities, multilingual assist.
8. **Operations Center** — incident queue, resource coordination.
9. **Maps Center** — interactive stadium + city map, layers, routing.
10. **Reports Center** — generated PDFs/briefs, trend + forecast charts.
11. **Settings** — persona, language, theme, RAG sources.
12. **API Status Center** — health of all 5 required APIs + gateway.

## 6. Design System

- Custom tokens in `src/styles.css` (oklch): deep pitch-green + tournament-gold accent + neutral slate, dark-first with light mode.
- Glassmorphism cards, gradient accents, motion micro-interactions, skeleton loaders.
- Typography: Space Grotesk (display) + Inter (body) via `<link>` in `__root.tsx`.
- Full component library: KPI card, DecisionCard, AgentTrace, RiskBadge, ConfidenceMeter, MapPanel, ChartFrame, Alert, Modal, Nav.
- WCAG AA: keyboard nav, ARIA, focus rings, contrast-checked palette, `h-dvh`, screen-reader labels.

## 7. Required Env Vars (exact names)

`.env.example` and all server code read:
- `GEMINI_API_KEY`
- `SEARCH_API_KEY`
- `AIMODE_API_KEY`
- `LOCAL_API_KEY`
- `MAPS_API_KEY`

An internal adapter maps these to the Lovable AI Gateway at runtime so the app runs inside Lovable while remaining spec-compliant when deployed to Cloud Run / Colab with real Google keys.

## 8. Anti-Plagiarism / Git-Blob Compliance

- All source files authored fresh in this project — no copied READMEs, no templated hackathon boilerplate.
- README.md written with a unique narrative structure (Challenge → Thesis → Architecture → Decision Model → Agents → RAG → Deployment → Evaluation Map → Assumptions).
- Distinct code style, distinct comments, distinct component names.
- Repo kept <10 MB, single branch, public-GitHub compatible, no bundled binaries.

## 9. Deliverable Files (new/edited)

**App code**
- `src/routes/__root.tsx` (metadata, fonts, providers)
- `src/routes/index.tsx` (landing)
- `src/routes/dashboard.tsx`, `command.tsx`, `crowd.tsx`, `transport.tsx`, `accessibility.tsx`, `fan.tsx`, `operations.tsx`, `maps.tsx`, `reports.tsx`, `settings.tsx`, `status.tsx`
- `src/components/**` (design system + intelligence widgets)
- `src/lib/agents/*.functions.ts` (each agent)
- `src/lib/agents/coordinator.functions.ts`
- `src/lib/rag/*.functions.ts` (upload, embed, query)
- `src/lib/ai-gateway.server.ts` + `src/lib/env.server.ts` (env adapter)
- `src/routes/api/health.ts` (API status)
- `src/styles.css` (design tokens)

**Backend (Lovable Cloud migration)**
- `rag_documents`, `rag_chunks` (pgvector), `agent_traces`, `decisions`, `incidents` with GRANTs + RLS + `user_roles` pattern.

**Docs & ops**
- `README.md` (comprehensive, original)
- `.env.example`, `.gitignore`, `requirements.txt` (for Colab), `Dockerfile`
- `docs/architecture.md`, `docs/deployment.md`, `docs/testing.md`, `docs/demo_script.md`, `docs/project_structure.md`, `docs/colab_guide.md`, `docs/google_ai_studio.md`

## 10. Testing & Verification

- Type check (`tsgo`) and build must pass.
- Vitest unit tests for agent JSON parsing, RAG chunker, decision-engine merging.
- Playwright smoke: landing → command center → run a sample decision → dashboard renders.
- Accessibility audit pass (keyboard + ARIA + contrast).
- API Status page live-pings each configured key (graceful fallback when absent).

## 11. Out of Scope (explicit)

- Real FIFA data feeds (mock/demo datasets included with clear labeling).
- Native mobile app.
- Payment processing.

---

**Approve this plan** and I'll implement it end-to-end in build mode, including Lovable Cloud enablement for RAG storage, all pages, agents, docs, and a final build + smoke test before handing back.
