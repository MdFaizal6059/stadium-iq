# WorldCupIQ AI

> **AI-Powered Stadium Decision Intelligence for FIFA World Cup 2026.**
> Not a chatbot. Not a Q&A bot. An operating system for decisions.

WorldCupIQ AI is a production-grade multi-agent GenAI platform that turns
crowd, transportation, accessibility, venue and tournament signals into
**actionable decisions** for organizers, operations, volunteers, staff
and fans across the 16 FIFA World Cup 2026 host cities.

Every user interaction returns the same seven-part decision object:
**situation → risks → predictions → options → recommendation → impact → confidence**.

---

**Click this link to view the web app:** https://worldcupiq-ops-vision.lovable.app/
## 1. Challenge alignment

The FIFA World Cup 2026 GenAI challenge asks builders to enhance stadium
operations and the tournament experience across navigation, crowd
management, accessibility, transportation, sustainability, multilingual
support, operational intelligence and real-time decision support.

WorldCupIQ AI answers that brief with a single, coherent thesis:

> **Great stadium operations are not a search problem — they are a
> *decision* problem.** Data without a next step is noise. Every fan,
> volunteer, staffer and executive needs the same thing: the best next
> action, with a confidence score and the reasoning behind it.

That thesis drives every design decision in this repository.

## 2. What it is (and what it deliberately is not)

| ✅ WorldCupIQ AI is                          | 🚫 WorldCupIQ AI is not                  |
| ------------------------------------------- | --------------------------------------- |
| A Stadium Decision Intelligence OS          | A chatbot                                |
| A multi-agent GenAI system on Gemini        | A match-info bot                         |
| A grounded RAG platform over tournament docs| A generic AI assistant                   |
| A commercial-grade operational surface      | A prototype                              |

## 3. Architecture at a glance

```text
User Request (Fan / Volunteer / Staff / Operations / Accessibility)
       │
       ▼
 Coordinator Agent
       │
       ├──▶ Context Builder  (RAG + Search + AI Mode + Local + Maps)
       ├──▶ Fan Experience   Agent
       ├──▶ Navigation       Agent
       ├──▶ Crowd            Intelligence Agent
       ├──▶ Transportation   Agent
       ├──▶ Accessibility    Agent
       ├──▶ Sustainability   Agent
       ├──▶ Operations       Agent
       ├──▶ Emergency        Response Agent
       ├──▶ Recommendation   Agent
       └──▶ Reporting        Agent
       │
       ▼
 Decision Engine ──▶ { situation, risks, predictions, options,
                       recommendation, impact, confidence, sources }
       │
       ▼
 UI: Agent Reasoning Timeline + Actionable Decision Card
```

Full architecture in [`docs/architecture.md`](docs/architecture.md).

## 4. Features

### Nine intelligence modules

- Executive Command Center
- Crowd Intelligence Center
- Transportation Intelligence
- Accessibility Intelligence
- Fan Experience Center
- Operations Intelligence
- Risk Monitoring Center
- Emergency Support Center
- Sustainability Intelligence

### Five persona experiences

- **Fan** — navigation, transport, food, safety, multilingual
- **Volunteer** — visitor assistance, escalation scripts
- **Venue staff** — crowd, incidents, resource coordination
- **Operations** — executive dashboard, risk, recommendations
- **Accessibility** — step-free routing, assisted services

### Responsible AI, by construction

- Every decision returns a **confidence score**.
- Every decision cites its **sources** (RAG / Search / AI Mode / Local / Maps / context).
- Every decision carries a **data-quality note** describing its limitations.
- Low-confidence outputs degrade to a **rulebook fallback** rather than
  fabricating specifics.

## 5. Tech stack

- **Frontend** — React 19, TanStack Start, Tailwind v4, Recharts, shadcn/ui
- **Backend** — TanStack `createServerFn` + `/api/*` server routes
- **AI** — Gemini via the OpenAI-compatible Lovable AI Gateway
- **Design** — Custom dark-first tournament palette, `Space Grotesk` +
  `Inter`, glassmorphism, WCAG-AA compliant

Repository size is intentionally kept below 10 MB. Single branch.
Public-GitHub compatible.

## 6. Required API environment variables

All five variables use the **exact** names the challenge requires.

| Variable         | Purpose                                           |
| ---------------- | ------------------------------------------------- |
| `GEMINI_API_KEY` | Reasoning, agent coordination, structured decisions |
| `SEARCH_API_KEY` | Real-time search & event intelligence             |
| `AIMODE_API_KEY` | AI Mode deep information retrieval                |
| `LOCAL_API_KEY`  | Local services & nearby facilities                |
| `MAPS_API_KEY`   | Navigation & geospatial intelligence              |

Inside the Lovable managed environment, `LOVABLE_API_KEY` is
auto-provisioned and satisfies the `GEMINI_API_KEY` role by routing model
traffic through the Lovable AI Gateway. On Cloud Run / Colab, provide the
challenge variables directly. See [`.env.example`](.env.example).

## 7. Running locally

```bash
bun install
bun run dev
# open http://localhost:8080
```

The application boots on the landing page; the sidebar unlocks every
intelligence module. Try `/command` for the multi-agent decision engine
and `/status` for a live probe of the five required APIs.

## 8. Deployment

- **Cloud Run** — see [`docs/deployment.md`](docs/deployment.md)
- **Docker** — see [`Dockerfile`](Dockerfile)
- **Google Colab** — see [`docs/colab_guide.md`](docs/colab_guide.md)
- **Google AI Studio** — see [`docs/google_ai_studio.md`](docs/google_ai_studio.md)

## 9. Testing

WorldCupIQ AI ships with an automated Vitest + React Testing Library suite
that runs on every push via GitHub Actions (`.github/workflows/ci.yml`).

```bash
bun run test            # run the full unit suite
bun run test:watch      # watch mode
bun run test:coverage   # V8 coverage report
```

The suite covers the 16 FIFA 2026 host stadium dataset, the decision RPC
input schema (including the strict Gemini model allowlist), the `cn`
utility, and the presentational components (`ConfidenceMeter`,
`SectionHeading`, `AgentTraceList`) — including ARIA `progressbar`
semantics.

See [`docs/testing.md`](docs/testing.md) for the full layered plan and
[`docs/testing_report.md`](docs/testing_report.md) for a per-file snapshot.

## 10. Assumptions

- Demo data (crowd, transportation, accessibility metrics) is synthetic
  and clearly labeled. In a live tournament deployment the same
  interfaces would be fed by venue telemetry, transit authority APIs and
  the operations command channel.
- The stadium map is a stylized SVG; connect `MAPS_API_KEY` for live
  tiles.
- The RAG store ships empty; upload venue guides, transport plans,
  accessibility protocols and emergency procedures via Settings.

## 11. Repository layout

See [`docs/project_structure.md`](docs/project_structure.md).

## 12. Originality statement

Every file in this repository — including this README, the design
system, the decision-engine prompt, the multi-agent code, all page
layouts and all component APIs — was authored specifically for
WorldCupIQ AI. No hackathon boilerplate was copied. No README template
was cloned. The Git history reflects a single-author, single-branch,
incremental build.

## 13. License

MIT. Built for the FIFA World Cup 2026 GenAI challenge.

---

*"AI-Powered Stadium Intelligence for FIFA World Cup 2026."*
