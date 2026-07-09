import { createFileRoute } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { DecisionCard } from "@/components/decision-card";
import { AgentTraceList } from "@/components/agent-trace";
import { SectionHeading } from "@/components/section-heading";
import { runDecision, type DecisionResult } from "@/lib/decision.functions";
import { HOST_STADIUMS } from "@/lib/stadiums";
import { Sparkles, Send, Loader2 } from "lucide-react";

export const Route = createFileRoute("/command")({
  head: () => ({
    meta: [
      { title: "AI Command Center · WorldCupIQ AI" },
      {
        name: "description",
        content:
          "Multi-agent GenAI command center: submit a decision request and see the coordinator, specialist agents and grounded recommendation for FIFA World Cup 2026 stadium operations.",
      },
    ],
  }),
  component: CommandPage,
});

const PERSONAS = [
  { id: "operations", label: "Operations" },
  { id: "fan", label: "Fan" },
  { id: "volunteer", label: "Volunteer" },
  { id: "staff", label: "Venue staff" },
  { id: "accessibility", label: "Accessibility" },
] as const;

const PRESETS = [
  "Gate E crowd density is approaching threshold at kickoff-30. What should we do?",
  "Wheelchair-using fan needs an accessible route from South Plaza to Section 118.",
  "Metro line 3 has a 4-minute delay. Should we adjust bus dispatch?",
  "Predict food & beverage bottlenecks for the next 30 minutes in Zone B.",
  "A volunteer reports a lost child near Gate C. Give me an escalation plan.",
];

function CommandPage() {
  const [query, setQuery] = useState(PRESETS[0]);
  const [persona, setPersona] = useState<(typeof PERSONAS)[number]["id"]>("operations");
  const [venue, setVenue] = useState(`${HOST_STADIUMS[7].name}, ${HOST_STADIUMS[7].city}`);
  const runDecisionFn = useServerFn(runDecision);

  const mutation = useMutation({
    mutationFn: (input: { query: string; persona: string; venue: string }) =>
      runDecisionFn({ data: input }) as unknown as Promise<DecisionResult>,
  });

  const result = mutation.data;

  return (
    <AppShell
      title="AI Command Center"
      subtitle="Coordinator → specialist agents → decision engine → actionable output"
    >
      <div className="grid gap-6 xl:grid-cols-3">
        <form
          className="glass xl:col-span-2 rounded-2xl p-5"
          onSubmit={(e) => {
            e.preventDefault();
            mutation.mutate({ query, persona, venue });
          }}
        >
          <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-muted-foreground" htmlFor="q">
            Decision request
          </label>
          <textarea
            id="q"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            rows={3}
            className="w-full resize-y rounded-xl border border-border/70 bg-background/60 px-3 py-2 text-sm outline-none ring-primary/30 focus:ring-2"
            placeholder="Describe the situation to the multi-agent decision engine…"
          />

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-muted-foreground">Persona</label>
              <div className="flex flex-wrap gap-1.5">
                {PERSONAS.map((p) => (
                  <button
                    type="button"
                    key={p.id}
                    onClick={() => setPersona(p.id)}
                    className={
                      "rounded-full px-3 py-1 text-xs ring-1 transition " +
                      (persona === p.id
                        ? "bg-primary text-primary-foreground ring-primary"
                        : "bg-background/60 text-muted-foreground ring-border hover:text-foreground")
                    }
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-muted-foreground" htmlFor="venue">
                Venue context
              </label>
              <select
                id="venue"
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                className="w-full rounded-xl border border-border/70 bg-background/60 px-3 py-2 text-sm outline-none ring-primary/30 focus:ring-2"
              >
                {(["USA", "Canada", "Mexico"] as const).map((c) => (
                  <optgroup key={c} label={c}>
                    {HOST_STADIUMS.filter((s) => s.country === c).map((s) => (
                      <option key={s.id} value={`${s.name}, ${s.city}`}>
                        {s.name} — {s.city}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <button
              type="submit"
              disabled={mutation.isPending}
              className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow shadow-primary/20 transition hover:opacity-90 disabled:opacity-60"
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> Running agents…
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" aria-hidden /> Run decision engine
                </>
              )}
            </button>
            <span className="text-xs text-muted-foreground">
              <Send className="mr-1 inline h-3 w-3" aria-hidden /> Grounded reasoning · confidence-scored
            </span>
          </div>

          <div className="mt-4">
            <div className="mb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">Presets</div>
            <div className="flex flex-wrap gap-1.5">
              {PRESETS.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setQuery(p)}
                  className="rounded-full border border-border/70 bg-background/40 px-3 py-1 text-xs text-muted-foreground hover:text-foreground"
                >
                  {p.slice(0, 48)}
                  {p.length > 48 ? "…" : ""}
                </button>
              ))}
            </div>
          </div>
        </form>

        <aside className="glass rounded-2xl p-5">
          <SectionHeading eyebrow="Agent pipeline" title="Coordinator + specialists" />
          {result ? (
            <AgentTraceList agents={result.agents} />
          ) : (
            <p className="text-sm text-muted-foreground">
              Submit a decision request. You'll see the coordinator route the request across the
              specialist agents in real time, with per-agent latency and notes.
            </p>
          )}
        </aside>
      </div>

      <div className="mt-6">
        {mutation.isPending ? (
          <div className="glass grid animate-pulse gap-3 rounded-2xl p-6">
            <div className="h-6 w-2/3 rounded bg-muted" />
            <div className="h-4 w-full rounded bg-muted" />
            <div className="h-4 w-1/2 rounded bg-muted" />
            <div className="mt-4 h-24 rounded bg-muted" />
          </div>
        ) : result ? (
          <DecisionCard result={result} />
        ) : (
          <div className="glass rounded-2xl p-6 text-sm text-muted-foreground">
            The decision card will appear here — with situation, risks, predictions, options,
            recommended action, impact and confidence score.
          </div>
        )}
      </div>
    </AppShell>
  );
}