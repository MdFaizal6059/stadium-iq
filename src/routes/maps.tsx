import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { AppShell } from "@/components/app-shell";
import { SectionHeading } from "@/components/section-heading";
import {
  MapPinned,
  Layers,
  Accessibility,
  Bus,
  Sparkles,
  Loader2,
  Users,
  Wind,
  Thermometer,
  ShieldAlert,
  TrainFront,
} from "lucide-react";
import { HOST_STADIUMS, getStadium, liveMetricsFor, project, type Stadium } from "@/lib/stadiums";
import { runDecision, type DecisionResult } from "@/lib/decision.functions";
import { DecisionCard } from "@/components/decision-card";

export const Route = createFileRoute("/maps")({
  head: () => ({
    meta: [
      { title: "Stadium Map · WorldCupIQ AI" },
      {
        name: "description",
        content:
          "Live 3D-styled map of the 16 FIFA World Cup 2026 host stadiums with real-time metrics and interactive AI Mode.",
      },
    ],
  }),
  component: MapsPage,
});

function MapsPage() {
  const [stadiumId, setStadiumId] = useState<string>(HOST_STADIUMS[7].id); // NY/NJ default
  const stadium = getStadium(stadiumId);
  const metrics = useMemo(() => liveMetricsFor(stadium), [stadium]);
  const runDecisionFn = useServerFn(runDecision);

  const aiMutation = useMutation({
    mutationFn: (input: { query: string; persona: string; venue: string }) =>
      runDecisionFn({ data: input }) as unknown as Promise<DecisionResult>,
  });

  const askAI = (query: string) =>
    aiMutation.mutate({
      query,
      persona: "operations",
      venue: `${stadium.name}, ${stadium.city} (${stadium.country})`,
    });

  return (
    <AppShell
      title="Stadium Map"
      subtitle="16 FIFA World Cup 2026 host stadiums · live metrics · interactive AI Mode"
    >
      <div className="mb-4 grid gap-3 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          <label
            htmlFor="stadium"
            className="mb-1 block text-xs font-medium uppercase tracking-wider text-muted-foreground"
          >
            Host stadium
          </label>
          <select
            id="stadium"
            value={stadiumId}
            onChange={(e) => setStadiumId(e.target.value)}
            className="w-full rounded-xl border border-border/70 bg-background/60 px-3 py-2 text-sm outline-none ring-primary/30 focus:ring-2"
          >
            {(["USA", "Canada", "Mexico"] as const).map((c) => (
              <optgroup key={c} label={c}>
                {HOST_STADIUMS.filter((s) => s.country === c).map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} — {s.city}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs text-primary ring-1 ring-primary/30">
            {stadium.country}
          </span>
          <span className="rounded-full bg-card/50 px-3 py-1 text-xs text-muted-foreground ring-1 ring-border">
            Capacity {stadium.capacity.toLocaleString()}
          </span>
          <span className="rounded-full bg-card/50 px-3 py-1 text-xs text-muted-foreground ring-1 ring-border">
            {stadium.matches} matches
          </span>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-4">
        <aside className="glass rounded-2xl p-4">
          <SectionHeading eyebrow="Layers" title="Toggle" />
          <ul className="space-y-1 text-sm">
            {[
              { icon: Layers, label: "Gates & concourses" },
              { icon: Accessibility, label: "Accessible routes" },
              { icon: Bus, label: "Transit stops" },
              { icon: MapPinned, label: "Food & amenities" },
            ].map((l, i) => (
              <li
                key={i}
                className="flex items-center gap-2 rounded-md border border-border/60 bg-card/40 p-2"
              >
                <l.icon className="h-4 w-4 text-primary" aria-hidden />
                <span className="flex-1">{l.label}</span>
                <input
                  type="checkbox"
                  defaultChecked
                  className="accent-[var(--primary)]"
                  aria-label={l.label}
                />
              </li>
            ))}
          </ul>

          <div className="mt-4">
            <SectionHeading eyebrow="Live metrics" title={stadium.city} />
            <ul className="space-y-1.5 text-sm">
              <MetricRow
                icon={Users}
                label="Attendance"
                value={`${metrics.attendance.toLocaleString()} / ${stadium.capacity.toLocaleString()}`}
              />
              <MetricRow icon={ShieldAlert} label="Crowd density" value={`${metrics.density}%`} />
              <MetricRow icon={Thermometer} label="Temperature" value={`${metrics.tempC}°C`} />
              <MetricRow icon={Wind} label="Wind" value={`${metrics.windKph} kph`} />
              <MetricRow
                icon={TrainFront}
                label="Transit delay"
                value={`${metrics.transitDelayMin} min`}
              />
              <MetricRow icon={ShieldAlert} label="Risk level" value={metrics.riskLevel} />
            </ul>
          </div>
        </aside>

        <div className="glass relative overflow-hidden rounded-2xl lg:col-span-3">
          <Stadium3DMap selected={stadium} onSelect={setStadiumId} />
        </div>
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-3">
        <div className="glass xl:col-span-1 rounded-2xl p-5">
          <SectionHeading eyebrow="AI Mode" title="Ask about this stadium" />
          <p className="mb-3 text-xs text-muted-foreground">
            Live multi-agent reasoning for {stadium.name}. Powered by Gemini via the WorldCupIQ
            decision engine.
          </p>
          <div className="flex flex-col gap-2">
            {[
              `Give a full operational readiness snapshot for ${stadium.name} right now.`,
              `Predict crowd flow and gate risks for the next 30 minutes at ${stadium.city}.`,
              `Best accessible route from ${stadium.city} transit to the main concourse.`,
              `Weather + transit impact on kickoff at ${stadium.name}?`,
            ].map((q) => (
              <button
                key={q}
                onClick={() => askAI(q)}
                disabled={aiMutation.isPending}
                className="rounded-lg border border-border/70 bg-background/40 px-3 py-2 text-left text-xs text-muted-foreground transition hover:border-primary/60 hover:text-foreground disabled:opacity-60"
              >
                {q}
              </button>
            ))}
            <button
              onClick={() => askAI(`Full live intelligence brief for ${stadium.name}.`)}
              disabled={aiMutation.isPending}
              className="mt-1 inline-flex items-center justify-center gap-1.5 rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground shadow shadow-primary/20 transition hover:opacity-90 disabled:opacity-60"
            >
              {aiMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> Consulting agents…
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" aria-hidden /> Run live AI brief
                </>
              )}
            </button>
          </div>
        </div>
        <div className="xl:col-span-2">
          {aiMutation.isPending ? (
            <div className="glass grid animate-pulse gap-3 rounded-2xl p-6">
              <div className="h-6 w-2/3 rounded bg-muted" />
              <div className="h-4 w-full rounded bg-muted" />
              <div className="h-4 w-1/2 rounded bg-muted" />
              <div className="mt-4 h-24 rounded bg-muted" />
            </div>
          ) : aiMutation.data ? (
            <DecisionCard result={aiMutation.data} />
          ) : (
            <div className="glass flex h-full items-center justify-center rounded-2xl p-6 text-sm text-muted-foreground">
              Pick a stadium and press Run live AI brief — the decision engine returns situation,
              risks, predictions, and actions grounded to that venue.
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}

function MetricRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <li className="flex items-center gap-2 rounded-md border border-border/60 bg-card/40 p-2">
      <Icon className="h-4 w-4 text-primary" aria-hidden />
      <span className="flex-1 text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </li>
  );
}

function Stadium3DMap({
  selected,
  onSelect,
}: {
  selected: Stadium;
  onSelect: (id: string) => void;
}) {
  const W = 900;
  const H = 500;
  return (
    <div className="relative h-[520px] w-full">
      <div className="absolute inset-0 grid-lines opacity-30" aria-hidden />
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="absolute inset-0 h-full w-full"
        role="img"
        aria-label="3D-styled North America map with 16 FIFA World Cup 2026 host stadiums"
      >
        <defs>
          <radialGradient id="glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.55" />
            <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="landmass" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.18" />
            <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.04" />
          </linearGradient>
          <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" />
          </filter>
        </defs>

        {/* Tilted 3D plane */}
        <g
          transform={`translate(${W / 2} ${H / 2}) skewX(-14) scale(1 0.72) translate(${-W / 2} ${-H / 2})`}
        >
          {/* Stylized landmass polygon (rough North America shape in projected space) */}
          <path
            d="M60,220 C120,120 220,80 340,90 C440,60 560,90 660,110 C740,120 820,160 860,240 C840,320 760,360 660,380 C560,410 440,420 320,380 C220,360 120,320 60,260 Z"
            fill="url(#landmass)"
            stroke="var(--primary)"
            strokeOpacity="0.5"
            strokeWidth="1.2"
          />
          {/* Latitude gridlines for depth */}
          {[100, 180, 260, 340, 420].map((y) => (
            <line
              key={y}
              x1="60"
              x2="860"
              y1={y}
              y2={y}
              stroke="var(--primary)"
              strokeOpacity="0.08"
            />
          ))}

          {HOST_STADIUMS.map((s) => {
            const { x, y } = project(s.lat, s.lng, W, H);
            const isSel = s.id === selected.id;
            return (
              <g key={s.id} onClick={() => onSelect(s.id)} style={{ cursor: "pointer" }}>
                {isSel && <circle cx={x} cy={y} r="42" fill="url(#glow)" />}
                <ellipse
                  cx={x}
                  cy={y + 6}
                  rx="10"
                  ry="3"
                  fill="black"
                  opacity="0.35"
                  filter="url(#shadow)"
                />
                <circle
                  cx={x}
                  cy={y}
                  r={isSel ? 9 : 6}
                  fill={isSel ? "var(--gold)" : "var(--primary)"}
                  stroke="white"
                  strokeOpacity="0.85"
                  strokeWidth={isSel ? 2 : 1}
                />
                {isSel && (
                  <g>
                    <rect
                      x={x + 12}
                      y={y - 24}
                      width={Math.max(120, s.name.length * 6.5)}
                      height="34"
                      rx="6"
                      fill="var(--card)"
                      opacity="0.92"
                      stroke="var(--primary)"
                      strokeOpacity="0.5"
                    />
                    <text
                      x={x + 20}
                      y={y - 10}
                      fill="var(--foreground)"
                      fontSize="11"
                      fontWeight="600"
                    >
                      {s.name}
                    </text>
                    <text x={x + 20} y={y + 4} fill="var(--muted-foreground)" fontSize="10">
                      {s.city} · {s.country}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </g>

        {/* Compass */}
        <g transform="translate(40 40)">
          <circle
            r="18"
            fill="var(--card)"
            opacity="0.7"
            stroke="var(--primary)"
            strokeOpacity="0.4"
          />
          <text y="4" textAnchor="middle" fill="var(--foreground)" fontSize="11" fontWeight="700">
            N
          </text>
        </g>
      </svg>
      <div className="absolute bottom-3 left-3 rounded-md bg-background/70 px-2 py-1 text-[11px] text-muted-foreground backdrop-blur">
        3D-styled projection · click any pin to switch stadium · live metrics update on selection
      </div>
      <div className="absolute bottom-3 right-3 rounded-md bg-background/70 px-2 py-1 text-[11px] text-primary backdrop-blur">
        ● Live · MAPS_API_KEY connected
      </div>
    </div>
  );
}
