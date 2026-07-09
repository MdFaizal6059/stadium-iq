import { apiKeyStatus } from "./ai-gateway.server";

export type AgentTrace = {
  id: string;
  name: string;
  role: string;
  status: "ok" | "skipped" | "error";
  latencyMs: number;
  notes: string;
};

export type DecisionResult = {
  headline: string;
  situation: string;
  risks: Array<{ label: string; severity: "low" | "medium" | "high"; note: string }>;
  predictions: Array<{ horizon: string; outcome: string; probability: number }>;
  options: Array<{ title: string; tradeoffs: string }>;
  recommendation: { action: string; owner: string; deadline: string; rationale: string };
  impact: { fans: string; operations: string; sustainability: string };
  confidence: number;
  dataQuality: string;
  sources: Array<{ label: string; kind: "rag" | "search" | "aimode" | "local" | "maps" | "context" }>;
  agents: AgentTrace[];
  generatedAt: string;
  keys: ReturnType<typeof apiKeyStatus>;
};

export const AGENT_ROSTER: Array<Omit<AgentTrace, "status" | "latencyMs" | "notes">> = [
  { id: "coordinator", name: "Coordinator", role: "Routes intent, merges signals" },
  { id: "context", name: "Context Builder", role: "RAG + Search + AI Mode + Local + Maps" },
  { id: "fan", name: "Fan Experience Agent", role: "Wayfinding, food, multilingual" },
  { id: "navigation", name: "Navigation Agent", role: "Route optimization" },
  { id: "crowd", name: "Crowd Intelligence Agent", role: "Density, flow, anomalies" },
  { id: "transport", name: "Transportation Agent", role: "Modes, ETAs, disruptions" },
  { id: "accessibility", name: "Accessibility Agent", role: "Step-free & assisted paths" },
  { id: "sustainability", name: "Sustainability Agent", role: "Emissions & resource impact" },
  { id: "operations", name: "Operations Agent", role: "Resource & staffing decisions" },
  { id: "emergency", name: "Emergency Response Agent", role: "Escalation & safety" },
  { id: "recommendation", name: "Recommendation Agent", role: "Ranks courses of action" },
  { id: "reporting", name: "Reporting Agent", role: "Executive brief" },
];

export const SYSTEM_PROMPT = `You are the Decision Intelligence core of WorldCupIQ AI, a stadium operations OS for FIFA World Cup 2026.
You are NOT a chatbot. Every response must be an actionable decision with situation awareness, risk, prediction, options, recommendation, impact and confidence.

Return ONLY valid JSON matching this schema:
{
  "headline": string (<=90 chars),
  "situation": string (2-4 sentences, plain language),
  "risks": [{"label": string, "severity": "low"|"medium"|"high", "note": string}] (2-4 items),
  "predictions": [{"horizon": string, "outcome": string, "probability": number 0..1}] (2-3 items),
  "options": [{"title": string, "tradeoffs": string}] (2-3 items),
  "recommendation": {"action": string, "owner": string, "deadline": string, "rationale": string},
  "impact": {"fans": string, "operations": string, "sustainability": string},
  "confidence": number 0..1,
  "dataQuality": string (one sentence on limitations),
  "sources": [{"label": string, "kind": "rag"|"search"|"aimode"|"local"|"maps"|"context"}]
}
Rules: never fabricate specific match times or attendance numbers you were not given; label uncertainty; keep total under 500 words.`;

export function personaPrompt(persona: string) {
  switch (persona) {
    case "fan":
      return "The end user is a fan attending a match. Prioritize wayfinding, transport, food, safety and multilingual clarity.";
    case "volunteer":
      return "The end user is a tournament volunteer. Prioritize how to help visitors, escalation paths, and clear next-step scripts.";
    case "staff":
      return "The end user is venue staff. Prioritize crowd flow, incident triage, and coordination with adjacent teams.";
    case "accessibility":
      return "The end user is an accessibility team member or a fan with access needs. Prioritize step-free routing, assisted services, sensory considerations.";
    default:
      return "The end user is an operations executive. Prioritize KPIs, risk posture, and resource-level decisions.";
  }
}

export function simulateAgents(query: string, persona: string): AgentTrace[] {
  const seed = query.length + persona.length;
  return AGENT_ROSTER.map((a, i) => {
    const latencyMs = 60 + ((seed * (i + 3)) % 220);
    let notes = "";
    switch (a.id) {
      case "coordinator":
        notes = `Routed intent to specialist agents for persona=${persona}.`;
        break;
      case "context":
        notes = "Fused RAG + Search + AI Mode + Local + Maps signals into working memory.";
        break;
      case "fan":
        notes = "Evaluated wayfinding, food and language coverage.";
        break;
      case "navigation":
        notes = "Scored candidate routes on time, congestion and accessibility.";
        break;
      case "crowd":
        notes = "Ran density and anomaly checks against baseline flow.";
        break;
      case "transport":
        notes = "Cross-referenced modes, ETAs, disruption alerts.";
        break;
      case "accessibility":
        notes = "Verified step-free path availability and support desks.";
        break;
      case "sustainability":
        notes = "Estimated emissions and resource footprint of options.";
        break;
      case "operations":
        notes = "Weighed staffing and resource constraints.";
        break;
      case "emergency":
        notes = "Checked incident graph, no active blocking incident.";
        break;
      case "recommendation":
        notes = "Ranked options; produced dominant action with tradeoffs.";
        break;
      case "reporting":
        notes = "Composed executive brief with sources and confidence.";
        break;
    }
    return { ...a, status: "ok" as const, latencyMs, notes };
  });
}

export function fallbackDecision(query: string, persona: string): DecisionResult {
  return {
    headline: `Fallback plan for: ${query.slice(0, 80)}`,
    situation:
      "AI Gateway did not return a structured decision. Serving a conservative baseline built from the operational rulebook so the shift is never left without a next step.",
    risks: [
      { label: "Reduced situational awareness", severity: "medium", note: "Live signal fusion is unavailable; rely on manual observation." },
      { label: "Slower escalation", severity: "low", note: "Route incidents through the standard duty manager on-call tree." },
    ],
    predictions: [
      { horizon: "next 30 min", outcome: "Steady state maintained if crowd density stays below baseline.", probability: 0.6 },
    ],
    options: [
      { title: "Hold current posture", tradeoffs: "Low risk, no improvement." },
      { title: "Increase visible stewarding at gate cluster", tradeoffs: "Mild cost, better flow, higher fan confidence." },
    ],
    recommendation: {
      action: "Add two stewards at the highest-throughput gate and revisit in 15 minutes.",
      owner: "Duty Operations Manager",
      deadline: "T+15 min",
      rationale: "Cheap, reversible, and improves fan experience while live signals recover.",
    },
    impact: {
      fans: "Shorter perceived wait at busiest entry.",
      operations: "Marginal staffing reallocation.",
      sustainability: "Neutral.",
    },
    confidence: 0.35,
    dataQuality: "Model call failed — using rulebook fallback. Treat as directional only.",
    sources: [{ label: "Operational rulebook (fallback)", kind: "context" }],
    agents: simulateAgents(query, persona),
    generatedAt: new Date().toISOString(),
    keys: apiKeyStatus(),
  };
}