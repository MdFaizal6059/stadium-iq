import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { KpiCard } from "@/components/kpi-card";
import { SectionHeading } from "@/components/section-heading";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { Users2, Activity, AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/crowd")({
  head: () => ({
    meta: [
      { title: "Crowd Intelligence · WorldCupIQ AI" },
      {
        name: "description",
        content: "Real-time crowd density, flow and anomaly detection across every stadium zone.",
      },
    ],
  }),
  component: CrowdPage,
});

const density = Array.from({ length: 30 }).map((_, i) => ({
  t: `T-${30 - i}m`,
  gateA: 40 + Math.round(30 * Math.sin(i / 3) + i),
  gateE: 55 + Math.round(35 * Math.sin(i / 4 + 1) + i * 1.4),
  concourse: 30 + Math.round(20 * Math.sin(i / 5)),
}));

const zones = [
  { z: "Gate A", density: 62, cap: 100, trend: "steady" },
  { z: "Gate B", density: 47, cap: 100, trend: "down" },
  { z: "Gate C", density: 71, cap: 100, trend: "up" },
  { z: "Gate D", density: 58, cap: 100, trend: "steady" },
  { z: "Gate E", density: 88, cap: 100, trend: "up" },
  { z: "Concourse N", density: 44, cap: 100, trend: "steady" },
  { z: "Concourse S", density: 55, cap: 100, trend: "up" },
  { z: "Fan Zone", density: 66, cap: 100, trend: "steady" },
];

function CrowdPage() {
  return (
    <AppShell
      title="Crowd Intelligence"
      subtitle="Density, flow, anomaly detection and predicted saturation"
    >
      <div className="grid gap-3 md:grid-cols-4">
        <KpiCard
          label="Peak density zone"
          value="Gate E"
          delta="88% of capacity"
          tone="warn"
          icon={<Users2 className="h-4 w-4" />}
        />
        <KpiCard
          label="Anomalies (24h)"
          value="2"
          delta="1 resolved"
          tone="warn"
          icon={<AlertTriangle className="h-4 w-4" />}
        />
        <KpiCard
          label="Flow throughput"
          value="4.1k / min"
          tone="good"
          icon={<Activity className="h-4 w-4" />}
        />
        <KpiCard label="Predicted saturation" value="T+18 min" hint="Gate E cluster" tone="warn" />
      </div>

      <div className="mt-6 glass rounded-2xl p-5">
        <SectionHeading eyebrow="Trend" title="Density index — last 30 minutes" />
        <div className="h-64">
          <ResponsiveContainer>
            <LineChart data={density} margin={{ left: -10, right: 10 }}>
              <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
              <XAxis dataKey="t" stroke="var(--muted-foreground)" fontSize={11} />
              <YAxis stroke="var(--muted-foreground)" fontSize={11} />
              <Tooltip
                contentStyle={{
                  background: "var(--popover)",
                  border: "1px solid var(--border)",
                  borderRadius: 12,
                }}
              />
              <Line
                type="monotone"
                dataKey="gateA"
                stroke="var(--primary)"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="gateE"
                stroke="var(--gold)"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="concourse"
                stroke="var(--chart-3)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-6 glass rounded-2xl p-5">
        <SectionHeading eyebrow="Zones" title="Live density heat" />
        <div className="grid gap-3 md:grid-cols-4">
          {zones.map((z) => {
            const pct = Math.min(100, (z.density / z.cap) * 100);
            const tone =
              pct >= 80 ? "var(--destructive)" : pct >= 60 ? "var(--gold)" : "var(--primary)";
            return (
              <div key={z.z} className="rounded-xl border border-border/60 bg-card/40 p-3">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">{z.z}</div>
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    {z.trend}
                  </span>
                </div>
                <div className="mt-1 font-display text-2xl font-semibold">{z.density}%</div>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${pct}%`, background: tone }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
