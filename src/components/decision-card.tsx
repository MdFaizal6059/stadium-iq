import type { DecisionResult } from "@/lib/decision.functions";
import { ConfidenceMeter } from "./confidence-meter";
import { AlertTriangle, Compass, Target, Sparkles, LineChart } from "lucide-react";

const severityTone: Record<string, string> = {
  low: "bg-primary/10 text-primary ring-1 ring-primary/20",
  medium: "bg-[color:var(--gold)]/15 text-[color:var(--gold)] ring-1 ring-[color:var(--gold)]/25",
  high: "bg-destructive/15 text-destructive ring-1 ring-destructive/25",
};

export function DecisionCard({ result }: { result: DecisionResult }) {
  return (
    <article className="glass rounded-2xl p-5 md:p-6">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="mb-1 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium uppercase tracking-wider text-primary ring-1 ring-primary/20">
            <Sparkles className="h-3 w-3" aria-hidden /> Decision Intelligence Output
          </div>
          <h2 className="font-display text-xl font-semibold tracking-tight md:text-2xl">
            {result.headline}
          </h2>
          <p className="mt-2 max-w-3xl text-sm text-muted-foreground">{result.situation}</p>
        </div>
        <div className="w-full max-w-[220px]">
          <ConfidenceMeter value={result.confidence} />
        </div>
      </header>

      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        <section aria-labelledby="risks-h" className="rounded-xl border border-border/60 bg-card/40 p-4">
          <h3 id="risks-h" className="mb-2 flex items-center gap-1.5 text-sm font-semibold">
            <AlertTriangle className="h-4 w-4 text-[color:var(--gold)]" aria-hidden /> Risks
          </h3>
          <ul className="space-y-2 text-sm">
            {result.risks.map((r, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className={"mt-0.5 rounded px-1.5 py-0.5 text-[10px] uppercase " + (severityTone[r.severity] ?? "")}>
                  {r.severity}
                </span>
                <div>
                  <div className="font-medium">{r.label}</div>
                  <div className="text-xs text-muted-foreground">{r.note}</div>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="pred-h" className="rounded-xl border border-border/60 bg-card/40 p-4">
          <h3 id="pred-h" className="mb-2 flex items-center gap-1.5 text-sm font-semibold">
            <LineChart className="h-4 w-4 text-primary" aria-hidden /> Predictions
          </h3>
          <ul className="space-y-2 text-sm">
            {result.predictions.map((p, i) => (
              <li key={i}>
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-wider text-muted-foreground">
                    {p.horizon}
                  </span>
                  <span className="text-xs font-medium">{Math.round(p.probability * 100)}%</span>
                </div>
                <div>{p.outcome}</div>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="opts-h" className="rounded-xl border border-border/60 bg-card/40 p-4">
          <h3 id="opts-h" className="mb-2 flex items-center gap-1.5 text-sm font-semibold">
            <Compass className="h-4 w-4 text-[color:var(--gold)]" aria-hidden /> Options
          </h3>
          <ul className="space-y-2 text-sm">
            {result.options.map((o, i) => (
              <li key={i}>
                <div className="font-medium">{o.title}</div>
                <div className="text-xs text-muted-foreground">{o.tradeoffs}</div>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section
        aria-labelledby="rec-h"
        className="mt-5 rounded-2xl border border-primary/30 p-5"
        style={{ background: "color-mix(in oklch, var(--primary) 10%, transparent)" }}
      >
        <h3 id="rec-h" className="mb-2 flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wider text-primary">
          <Target className="h-4 w-4" aria-hidden /> Recommended action
        </h3>
        <p className="font-display text-lg font-semibold tracking-tight md:text-xl">
          {result.recommendation.action}
        </p>
        <div className="mt-2 grid gap-2 text-xs text-muted-foreground md:grid-cols-3">
          <div><span className="text-foreground">Owner:</span> {result.recommendation.owner}</div>
          <div><span className="text-foreground">Deadline:</span> {result.recommendation.deadline}</div>
          <div><span className="text-foreground">Confidence:</span> {Math.round(result.confidence * 100)}%</div>
        </div>
        <p className="mt-2 text-sm">{result.recommendation.rationale}</p>
      </section>

      <div className="mt-5 grid gap-4 md:grid-cols-3">
        <Impact label="Fan impact" value={result.impact.fans} />
        <Impact label="Ops impact" value={result.impact.operations} />
        <Impact label="Sustainability" value={result.impact.sustainability} />
      </div>

      <footer className="mt-5 flex flex-wrap items-center gap-2 border-t border-border/60 pt-4 text-xs text-muted-foreground">
        <span className="font-medium text-foreground">Sources:</span>
        {result.sources.map((s, i) => (
          <span key={i} className="rounded-full bg-muted px-2 py-0.5 ring-1 ring-border">
            <span className="uppercase text-[10px] tracking-wider text-muted-foreground/80">{s.kind}</span>
            <span className="ml-1 text-foreground">{s.label}</span>
          </span>
        ))}
        <span className="ml-auto">{new Date(result.generatedAt).toLocaleTimeString()}</span>
      </footer>

      <p className="mt-3 text-[11px] italic text-muted-foreground">
        Responsible AI: {result.dataQuality}
      </p>
    </article>
  );
}

function Impact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border/60 bg-card/40 p-3">
      <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="text-sm">{value}</div>
    </div>
  );
}