import type { AgentTrace } from "@/lib/decision.functions";
import { CheckCircle2, AlertTriangle, MinusCircle } from "lucide-react";

export function AgentTraceList({ agents }: { agents: AgentTrace[] }) {
  return (
    <ol className="relative space-y-2 border-l border-border/60 pl-4">
      {agents.map((a) => (
        <li key={a.id} className="relative">
          <span
            aria-hidden
            className="absolute -left-[9px] top-2 grid h-3.5 w-3.5 place-items-center rounded-full bg-background ring-2 ring-primary/40"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          </span>
          <div className="flex items-start justify-between gap-3 rounded-lg border border-border/60 bg-card/40 p-3">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <div className="font-medium text-sm">{a.name}</div>
                <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">
                  {a.role}
                </span>
              </div>
              <div className="text-xs text-muted-foreground">{a.notes}</div>
            </div>
            <div className="flex items-center gap-2 whitespace-nowrap text-xs">
              {a.status === "ok" ? (
                <CheckCircle2 className="h-4 w-4 text-primary" aria-hidden />
              ) : a.status === "error" ? (
                <AlertTriangle className="h-4 w-4 text-destructive" aria-hidden />
              ) : (
                <MinusCircle className="h-4 w-4 text-muted-foreground" aria-hidden />
              )}
              <span className="text-muted-foreground">{a.latencyMs} ms</span>
            </div>
          </div>
        </li>
      ))}
    </ol>
  );
}