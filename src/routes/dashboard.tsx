import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { KpiCard } from "@/components/kpi-card";
import { SectionHeading } from "@/components/section-heading";
import {
  Users2,
  TramFront,
  Accessibility,
  Leaf,
  ShieldAlert,
  Activity,
  TrendingUp,
  Radar,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  Legend,
} from "recharts";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Executive Command Center · WorldCupIQ AI" },
      {
        name: "description",
        content:
          "Executive command center for FIFA World Cup 2026 stadium operations: crowd, transport, accessibility and risk KPIs in one view.",
      },
    ],
  }),
  component: DashboardPage,
});

const flow = Array.from({ length: 24 }).map((_, i) => ({
  t: `${String(i).padStart(2, "0")}:00`,
  gate: 800 + Math.round(600 * Math.sin(i / 3) + 400 * Math.cos(i / 5) + i * 40),
  transit: 400 + Math.round(300 * Math.sin(i / 4 + 1) + i * 30),
}));

const modes = [
  { m: "Metro", trips: 42000 },
  { m: "Bus", trips: 18400 },
  { m: "Walk", trips: 26100 },
  { m: "Rideshare", trips: 9800 },
  { m: "Bike", trips: 3200 },
];

const alerts = [
  { level: "high", label: "Gate E crowd density approaching threshold", ago: "2 min" },
  { level: "medium", label: "Metro line 3 experiencing 4-min delay", ago: "6 min" },
  { level: "low", label: "Accessibility desk N-2 restocked", ago: "12 min" },
  { level: "medium", label: "Volunteer shift change in Zone B in 20 min", ago: "just now" },
];

function DashboardPage() {
  return (
    <AppShell
      title="Executive Command Center"
      subtitle="Real-time situational awareness across all nine intelligence modules"
      actions={
        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary ring-1 ring-primary/25">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" /> LIVE
        </span>
      }
    >
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="Fans on venue campus"
          value="72,418"
          delta="+2.1% vs plan"
          tone="good"
          icon={<Users2 className="h-4 w-4" />}
        />
        <KpiCard
          label="Avg. gate wait"
          value="4m 12s"
          delta="-38s vs baseline"
          tone="good"
          icon={<Radar className="h-4 w-4" />}
        />
        <KpiCard
          label="Transit on-time"
          value="94.3%"
          delta="metro line 3 delay"
          tone="warn"
          icon={<TramFront className="h-4 w-4" />}
        />
        <KpiCard
          label="Accessible route uptime"
          value="100%"
          hint="all 12 corridors clear"
          tone="good"
          icon={<Accessibility className="h-4 w-4" />}
        />
        <KpiCard
          label="Active incidents"
          value="3"
          delta="1 escalated"
          tone="warn"
          icon={<ShieldAlert className="h-4 w-4" />}
        />
        <KpiCard
          label="Risk index"
          value="0.28"
          hint="0 = calm · 1 = severe"
          tone="good"
          icon={<TrendingUp className="h-4 w-4" />}
        />
        <KpiCard
          label="Emissions today"
          value="12.4 tCO₂e"
          delta="-6.8% vs baseline"
          tone="good"
          icon={<Leaf className="h-4 w-4" />}
        />
        <KpiCard
          label="Agent decisions / hr"
          value="284"
          delta="12 escalated"
          tone="default"
          icon={<Activity className="h-4 w-4" />}
        />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <div className="glass col-span-2 rounded-2xl p-5">
          <SectionHeading
            eyebrow="Crowd"
            title="Gate & transit flow — last 24 hours"
            description="Projected footfall vs realized transit boardings."
          />
          <div className="h-64">
            <ResponsiveContainer>
              <AreaChart data={flow} margin={{ left: -10, right: 10 }}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--gold)" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="var(--gold)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
                <XAxis dataKey="t" stroke="var(--muted-foreground)" fontSize={11} />
                <YAxis stroke="var(--muted-foreground)" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    background: "var(--popover)",
                    border: "1px solid var(--border)",
                    borderRadius: 12,
                    color: "var(--popover-foreground)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="gate"
                  stroke="var(--primary)"
                  fill="url(#g1)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="transit"
                  stroke="var(--gold)"
                  fill="url(#g2)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass rounded-2xl p-5">
          <SectionHeading eyebrow="Alerts" title="Live risk feed" />
          <ul className="space-y-2">
            {alerts.map((a, i) => (
              <li
                key={i}
                className="flex items-start gap-3 rounded-lg border border-border/60 bg-card/40 p-3"
              >
                <span
                  className={
                    "mt-0.5 h-2 w-2 shrink-0 rounded-full " +
                    (a.level === "high"
                      ? "bg-destructive"
                      : a.level === "medium"
                        ? "bg-[color:var(--gold)]"
                        : "bg-primary")
                  }
                />
                <div className="min-w-0 flex-1 text-sm">
                  <div>{a.label}</div>
                  <div className="text-xs text-muted-foreground">{a.ago}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <div className="glass col-span-2 rounded-2xl p-5">
          <SectionHeading eyebrow="Transportation" title="Mode split — today" />
          <div className="h-56">
            <ResponsiveContainer>
              <BarChart data={modes} margin={{ left: -10, right: 10 }}>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
                <XAxis dataKey="m" stroke="var(--muted-foreground)" fontSize={11} />
                <YAxis stroke="var(--muted-foreground)" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    background: "var(--popover)",
                    border: "1px solid var(--border)",
                    borderRadius: 12,
                    color: "var(--popover-foreground)",
                  }}
                />
                <Legend wrapperStyle={{ color: "var(--muted-foreground)", fontSize: 12 }} />
                <Bar dataKey="trips" fill="var(--primary)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="glass rounded-2xl p-5">
          <SectionHeading eyebrow="Executive brief" title="Now → Next 60 min" />
          <ul className="space-y-3 text-sm">
            <li className="rounded-lg border border-primary/25 bg-primary/8 p-3">
              <div className="text-[11px] uppercase tracking-wider text-primary">
                Recommended action
              </div>
              <div className="font-medium">
                Deploy +2 stewards to Gate E cluster within 10 minutes.
              </div>
            </li>
            <li className="rounded-lg border border-border/60 bg-card/40 p-3">
              <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
                Predicted
              </div>
              <div>Metro line 3 delay likely to resolve in 12 min (P=0.72).</div>
            </li>
            <li className="rounded-lg border border-border/60 bg-card/40 p-3">
              <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
                Risk posture
              </div>
              <div>Overall low. One medium risk pocket at Gate E.</div>
            </li>
          </ul>
        </div>
      </div>
    </AppShell>
  );
}
