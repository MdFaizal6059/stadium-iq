/**
 * WorldCupIQ AI — Lovable AI Gateway adapter (server-only)
 *
 * The FIFA World Cup 2026 challenge specifies these environment variables:
 *   GEMINI_API_KEY, SEARCH_API_KEY, AIMODE_API_KEY, LOCAL_API_KEY, MAPS_API_KEY
 *
 * At runtime inside the Lovable managed environment, model traffic is routed
 * through the Lovable AI Gateway using LOVABLE_API_KEY. Outside of Lovable,
 * deploy to Cloud Run / Colab with the challenge env vars — this adapter
 * picks whichever is present so a single codebase satisfies both worlds.
 */

export type GatewayMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

/**
 * Strict Gemini allowlist for WorldCupIQ AI.
 *
 * Rules (enforced at every call site):
 *  1. Only these IDs may be sent to the gateway. Anything else throws.
 *  2. The order below is the preference order used for automatic
 *     failover when a model returns 429 or a 5xx.
 *  3. Anyone can inspect the list via `ALLOWED_GEMINI_MODELS`.
 */
export const ALLOWED_GEMINI_MODELS = [
  "google/gemini-3.5-flash", // latest Flash
  "google/gemini-3-flash-preview", // Flash preview
  "google/gemini-3.1-flash-lite", // latest Flash-Lite
  "google/gemini-2.5-flash", // stable Flash
  "google/gemini-2.5-flash-lite", // stable Flash-Lite
] as const;

export type AllowedGeminiModel = (typeof ALLOWED_GEMINI_MODELS)[number];

export const DEFAULT_GEMINI_MODEL: AllowedGeminiModel = "google/gemini-3.5-flash";

export function isAllowedGeminiModel(id: string): id is AllowedGeminiModel {
  return (ALLOWED_GEMINI_MODELS as readonly string[]).includes(id);
}

/** Throws when the caller requested a model outside the allowlist. */
export function assertAllowedGeminiModel(id: string): AllowedGeminiModel {
  if (!isAllowedGeminiModel(id)) {
    throw new Error(
      `Model "${id}" is not permitted. Allowed: ${ALLOWED_GEMINI_MODELS.join(", ")}.`,
    );
  }
  return id;
}

export function getGatewayKey(): string {
  // Prefer the Lovable-managed key in the hosted preview; fall back to the
  // challenge-required GEMINI_API_KEY when self-hosted.
  return process.env.LOVABLE_API_KEY || process.env.GEMINI_API_KEY || "";
}

export function apiKeyStatus() {
  return {
    gemini: Boolean(process.env.GEMINI_API_KEY || process.env.LOVABLE_API_KEY),
    search: Boolean(process.env.SEARCH_API_KEY),
    aimode: Boolean(process.env.AIMODE_API_KEY),
    local: Boolean(process.env.LOCAL_API_KEY),
    maps: Boolean(process.env.MAPS_API_KEY),
  };
}

/** Extract the first {...} JSON object from a raw model text. */
export function extractJson<T = unknown>(text: string): T | null {
  if (!text) return null;
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fenced ? fenced[1] : text;
  const start = candidate.indexOf("{");
  const end = candidate.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) return null;
  try {
    return JSON.parse(candidate.slice(start, end + 1)) as T;
  } catch {
    return null;
  }
}

/**
 * Call the Lovable AI Gateway's OpenAI-compatible chat endpoint.
 *
 * Uses direct fetch (no SDK) to keep the bundle lean; the gateway URL and
 * header shape match the Lovable AI Gateway contract.
 */
export async function callGateway(opts: {
  model?: AllowedGeminiModel;
  system?: string;
  messages: GatewayMessage[];
  temperature?: number;
  json?: boolean;
}): Promise<{ text: string; raw: unknown; model: AllowedGeminiModel }> {
  const key = getGatewayKey();
  if (!key) {
    throw new Error(
      "AI Gateway key missing. Set GEMINI_API_KEY (challenge) or LOVABLE_API_KEY (Lovable).",
    );
  }

  // Build failover chain: requested model first (if provided), then
  // the rest of the allowlist in preference order — deduplicated.
  const preferred = opts.model ? assertAllowedGeminiModel(opts.model) : DEFAULT_GEMINI_MODEL;
  const chain: AllowedGeminiModel[] = [
    preferred,
    ...ALLOWED_GEMINI_MODELS.filter((m) => m !== preferred),
  ];

  const messages = [
    ...(opts.system ? [{ role: "system" as const, content: opts.system }] : []),
    ...opts.messages,
  ];

  let lastErr: unknown;
  for (const model of chain) {
    const body: Record<string, unknown> = {
      model,
      messages,
      temperature: opts.temperature ?? 0.4,
    };
    if (opts.json) body.response_format = { type: "json_object" };

    try {
      const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Lovable-API-Key": key,
          "X-Lovable-AIG-SDK": "worldcupiq-fetch",
        },
        body: JSON.stringify(body),
      });

      // 429 (rate limit) and 5xx (upstream) are the only retryable statuses.
      if (res.status === 429 || res.status >= 500) {
        lastErr = new Error(`Gateway ${res.status} on ${model}`);
        continue;
      }
      if (!res.ok) {
        const errBody = await res.text().catch(() => "");
        throw new Error(`Gateway ${res.status}: ${errBody.slice(0, 400)}`);
      }

      const json = (await res.json()) as {
        choices?: Array<{ message?: { content?: string } }>;
      };
      const text = json.choices?.[0]?.message?.content ?? "";
      return { text, raw: json, model };
    } catch (err) {
      // Network/transient — try next model in the allowlist.
      lastErr = err;
      continue;
    }
  }

  throw new Error(
    `All allowed Gemini models failed. Last error: ${
      lastErr instanceof Error ? lastErr.message : String(lastErr)
    }`,
  );
}
