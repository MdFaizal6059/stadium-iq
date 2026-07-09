import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function KpiCard({
  label,
  value,
  delta,
  hint,
  tone = "default",
  icon,
  className,
}: {
  label: string;
  value: ReactNode;
  delta?: string;
  hint?: string;
  tone?: "default" | "good" | "warn" | "bad";
  icon?: ReactNode;
  className?: string;
}) {
  const toneClass =
    tone === "good"
      ? "text-primary"
      : tone === "warn"
        ? "text-[color:var(--gold)]"
        : tone === "bad"
          ? "text-destructive"
          : "text-muted-foreground";
  return (
    <div className={cn("glass rounded-2xl p-4 shadow-sm", className)}>
      <div className="flex items-start justify-between gap-2">
        <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </div>
        {icon ? <div className="text-muted-foreground">{icon}</div> : null}
      </div>
      <div className="mt-2 font-display text-2xl font-semibold tracking-tight md:text-3xl">
        {value}
      </div>
      {(delta || hint) && (
        <div className="mt-1 flex items-center gap-2 text-xs">
          {delta ? <span className={toneClass}>{delta}</span> : null}
          {hint ? <span className="text-muted-foreground">{hint}</span> : null}
        </div>
      )}
    </div>
  );
}
