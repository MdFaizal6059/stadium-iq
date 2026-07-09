import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type { DecisionResult, AgentTrace } from "./decision.server";

export type { DecisionResult, AgentTrace };

const PERSONAS = ["fan", "volunteer", "staff", "operations", "accessibility"] as const;

export const DecisionInput = z.object({
  query: z.string().min(3).max(1200),
  persona: z.enum(PERSONAS).default("operations"),
  venue: z.string().max(120).optional(),
  language: z.string().max(20).optional(),
});

export type DecisionInputT = z.infer<typeof DecisionInput>;

export const runDecision = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => DecisionInput.parse(data))
  .handler(async ({ data }): Promise<DecisionResult> => {
    const {
      simulateAgents,
      fallbackDecision,
      SYSTEM_PROMPT,
      personaPrompt,
    } = await import("./decision.server");
    const { callGateway, extractJson, apiKeyStatus } = await import("./ai-gateway.server");

    const agents = simulateAgents(data.query, data.persona);
    const started = Date.now();
    try {
      const { text } = await callGateway({
        system: SYSTEM_PROMPT,
        messages: [
          {
            role: "user",
            content: [
              personaPrompt(data.persona),
              data.venue ? `Venue context: ${data.venue}.` : "",
              data.language ? `Preferred language: ${data.language}.` : "",
              `Decision request: ${data.query}`,
              "Return ONLY the JSON. No prose outside the JSON.",
            ]
              .filter(Boolean)
              .join("\n"),
          },
        ],
        json: true,
        temperature: 0.35,
      });

      const parsed = extractJson<Partial<DecisionResult>>(text);
      if (!parsed || !parsed.headline || !parsed.recommendation) {
        return fallbackDecision(data.query, data.persona);
      }

      const totalMs = Date.now() - started;
      const totalSum = agents.reduce((s: number, a: AgentTrace) => s + a.latencyMs, 0);
      const scaled = agents.map((a: AgentTrace) => ({
        ...a,
        latencyMs: Math.max(30, Math.round((a.latencyMs / totalSum) * totalMs)),
      }));

      return {
        headline: String(parsed.headline).slice(0, 120),
        situation: String(parsed.situation ?? ""),
        risks: Array.isArray(parsed.risks) ? parsed.risks.slice(0, 5) : [],
        predictions: Array.isArray(parsed.predictions) ? parsed.predictions.slice(0, 4) : [],
        options: Array.isArray(parsed.options) ? parsed.options.slice(0, 4) : [],
        recommendation: parsed.recommendation as DecisionResult["recommendation"],
        impact: (parsed.impact as DecisionResult["impact"]) ?? {
          fans: "-",
          operations: "-",
          sustainability: "-",
        },
        confidence: Math.min(1, Math.max(0, Number(parsed.confidence ?? 0.6))),
        dataQuality: String(
          parsed.dataQuality ?? "Grounded on tournament knowledge and simulated telemetry.",
        ),
        sources:
          Array.isArray(parsed.sources) && parsed.sources.length
            ? parsed.sources.slice(0, 8)
            : [{ label: "WorldCupIQ knowledge base", kind: "rag" as const }],
        agents: scaled,
        generatedAt: new Date().toISOString(),
        keys: apiKeyStatus(),
      };
    } catch (err) {
      console.error("[decision] gateway error", err);
      return fallbackDecision(data.query, data.persona);
    }
  });

export const getApiStatus = createServerFn({ method: "GET" }).handler(async () => {
  const { apiKeyStatus } = await import("./ai-gateway.server");
  return { ...apiKeyStatus(), generatedAt: new Date().toISOString() };
});