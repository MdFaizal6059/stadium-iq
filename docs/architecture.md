# WorldCupIQ AI — Architecture

WorldCupIQ AI is a Stadium Decision Intelligence Operating System for the
FIFA World Cup 2026. It is not a chatbot, not a Q&A assistant, and not a
notification feed. Every user interaction produces an actionable decision:
situation, risks, predictions, options, recommendation, impact, confidence.

## High-level flow

```text
           ┌────────────────────────────┐
           │  Fan / Volunteer / Staff / │
           │  Operations / Accessibility│
           └──────────────┬─────────────┘
                          │  intent + persona
                          ▼
                 ┌────────────────┐
                 │  Coordinator   │
                 │  Agent         │
                 └───────┬────────┘
                         │
   ┌─────────────────────┼─────────────────────────┐
   ▼                     ▼                         ▼
┌─────────┐        ┌────────────┐            ┌────────────┐
│ Context │        │ Specialist │  …  8×     │ Reporting  │
│ Builder │        │ Agents     │            │ Agent      │
└────┬────┘        └─────┬──────┘            └──────┬─────┘
     │                   │                          │
     ▼                   ▼                          ▼
  RAG store       Decision Engine            Executive brief
   + Search        (fuses signals)           + PDF-ready report
   + AI Mode
   + Local
   + Maps
```

## Agent roster

| Agent                | Responsibility                                     |
| -------------------- | -------------------------------------------------- |
| Coordinator          | Routes intent, merges signals, arbitrates          |
| Context Builder      | Fuses RAG / Search / AI Mode / Local / Maps        |
| Fan Experience       | Wayfinding, food, multilingual, safety             |
| Navigation           | Route optimization                                 |
| Crowd Intelligence   | Density, flow, anomalies                           |
| Transportation       | Modes, ETAs, disruptions                           |
| Accessibility        | Step-free & assisted paths                         |
| Sustainability       | Emissions & resource footprint                     |
| Operations           | Resource & staffing decisions                      |
| Emergency Response   | Escalation & safety                                |
| Recommendation       | Ranks courses of action                            |
| Reporting            | Executive brief + citations                        |

## Decision object

Every decision produced by the engine is a strict JSON object:

```json
{
  "headline": "…",
  "situation": "…",
  "risks":     [{ "label": "…", "severity": "low|medium|high", "note": "…" }],
  "predictions":[{ "horizon": "…", "outcome": "…", "probability": 0.72 }],
  "options":   [{ "title": "…", "tradeoffs": "…" }],
  "recommendation": { "action": "…", "owner": "…", "deadline": "…", "rationale": "…" },
  "impact":    { "fans": "…", "operations": "…", "sustainability": "…" },
  "confidence": 0.83,
  "dataQuality": "…",
  "sources":   [{ "label": "…", "kind": "rag|search|aimode|local|maps|context" }]
}
```

## RAG pipeline

```
Upload (PDF/CSV/TXT) → Chunker → Embeddings → Vector store →
Retriever → Grounded Gemini reasoning → Response with citations + confidence
```

Guardrails: refuse when retrieval confidence is low; always show sources;
return a data-quality note describing limitations.

## APIs

| Variable         | Purpose                                           |
| ---------------- | ------------------------------------------------- |
| `GEMINI_API_KEY` | Reasoning, coordination, structured decisions     |
| `SEARCH_API_KEY` | Real-time event intelligence                      |
| `AIMODE_API_KEY` | Deep information retrieval                        |
| `LOCAL_API_KEY`  | Nearby facilities & services                      |
| `MAPS_API_KEY`   | Navigation & geospatial intelligence              |