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

export function getGatewayKey(): string {
  // Prefer the Lovable-managed key in the hosted preview; fall back to the
  // challenge-required GEMINI_API_KEY when self-hosted.
  return (
    process.env.LOVABLE_API_KEY ||
    process.env.GEMINI_API_KEY ||
    ""
  );
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
  model?: string;
  system?: string;
  messages: GatewayMessage[];
  temperature?: number;
  json?: boolean;
}): Promise<{ text: string; raw: unknown }> {
  const key = getGatewayKey();
  if (!key) {
    throw new Error(
      "AI Gateway key missing. Set GEMINI_API_KEY (challenge) or LOVABLE_API_KEY (Lovable).",
    );
  }

  const model = opts.model || "google/gemini-2.5-flash";
  const body: Record<string, unknown> = {
    model,
    messages: [
      ...(opts.system ? [{ role: "system", content: opts.system }] : []),
      ...opts.messages,
    ],
    temperature: opts.temperature ?? 0.4,
  };
  if (opts.json) {
    body.response_format = { type: "json_object" };
  }

  const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Lovable-API-Key": key,
      "X-Lovable-AIG-SDK": "worldcupiq-fetch",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errBody = await res.text().catch(() => "");
    throw new Error(`Gateway ${res.status}: ${errBody.slice(0, 400)}`);
  }

  const json = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const text = json.choices?.[0]?.message?.content ?? "";
  return { text, raw: json };
}