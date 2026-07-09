import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { KpiCard } from "@/components/kpi-card";
import { SectionHeading } from "@/components/section-heading";
import { TramFront, Bus, Bike, Car, Footprints, AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/transport")({
  head: () => ({
    meta: [
      { title: "Transportation Intelligence · WorldCupIQ AI" },
      { name: "description", content: "Multimodal transport ETAs, disruptions and load balancing for FIFA World Cup 2026." },
    ],
  }),
  component: TransportPage,
});

const modes = [
  { name: "Metro line 3", icon: TramFront, eta: "6 min", load: 82, status: "delay" },
  { name: "Bus 42 shuttle", icon: Bus, eta: "3 min", load: 61, status: "on-time" },
  { name: "Bike share hub", icon: Bike, eta: "1 min", load: 34, status: "on-time" },
  { name: "Rideshare pickup", icon: Car, eta: "8 min", load: 74, status: "surge" },
  { name: "Pedestrian corridor", icon: Footprints, eta: "walk", load: 55, status: "on-time" },
];

function TransportPage() {
  return (
    <AppShell title="Transportation Intelligence" subtitle="Multimodal capacity, ETAs, disruption forecasts and route balancing">
      <div className="grid gap-3 md:grid-cols-4">
        <KpiCard label="On-time performance" value="94.3%" tone="good" />
        <KpiCard label="Avg. transit dwell" value="2m 41s" tone="good" />
        <KpiCard label="Active disruptions" value="1" delta="metro line 3" tone="warn" icon={<AlertTriangle className="h-4 w-4" />} />
        <KpiCard label="Predicted surge" value="Rideshare +18%" hint="kickoff+30 min" tone="warn" />
      </div>

      <div className="mt-6 glass rounded-2xl p-5">
        <SectionHeading eyebrow="Modes" title="Live status by mode" />
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {modes.map((m) => (
            <div key={m.name} className="flex items-start gap-3 rounded-xl border border-border/60 bg-card/40 p-3">
              <m.icon className="h-5 w-5 text-primary" aria-hidden />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">{m.name}</div>
                  <span
                    className={
                      "rounded px-1.5 py-0.5 text-[10px] uppercase " +
                      (m.status === "on-time"
                        ? "bg-primary/10 text-primary"
                        : m.status === "delay"
                        ? "bg-[color:var(--gold)]/15 text-[color:var(--gold)]"
                        : "bg-destructive/15 text-destructive")
                    }
                  >
                    {m.status}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground">ETA {m.eta} · load {m.load}%</div>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${m.load}%` }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 glass rounded-2xl p-5">
        <SectionHeading eyebrow="Recommendation" title="Dispatch plan for next 30 minutes" />
        <ol className="ml-4 list-decimal space-y-1 text-sm text-muted-foreground">
          <li className="text-foreground">Add two shuttle buses on line 42 to relieve metro line 3 backlog.</li>
          <li>Nudge rideshare toward secondary pickup at North Plaza to reduce surge.</li>
          <li>Open bike-share overflow racks near Gate C.</li>
          <li>Re-time pedestrian crossing at 3rd & Stadium to 60s cycle.</li>
        </ol>
      </div>
    </AppShell>
  );
}