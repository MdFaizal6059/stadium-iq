export function ConfidenceMeter({ value }: { value: number }) {
  const pct = Math.round(Math.min(1, Math.max(0, value)) * 100);
  const tone = pct >= 70 ? "var(--primary)" : pct >= 45 ? "var(--gold)" : "var(--destructive)";
  return (
    <div className="w-full">
      <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
        <span>Confidence</span>
        <span className="font-medium text-foreground">{pct}%</span>
      </div>
      <div
        className="h-2 w-full overflow-hidden rounded-full bg-muted"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full rounded-full transition-[width] duration-500"
          style={{
            width: `${pct}%`,
            background: `linear-gradient(90deg, ${tone}, color-mix(in oklch, ${tone} 60%, white))`,
          }}
        />
      </div>
    </div>
  );
}
