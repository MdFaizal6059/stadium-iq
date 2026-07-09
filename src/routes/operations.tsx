import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { KpiCard } from "@/components/kpi-card";
import { SectionHeading } from "@/components/section-heading";
import { ShieldAlert, Users2, Wrench, Radio } from "lucide-react";

export const Route = createFileRoute("/operations")({
  head: () => ({
    meta: [
      { title: "Operations Center · WorldCupIQ AI" },
      { name: "description", content: "Incident queue, resource coordination and staffing recommendations for FIFA World Cup 2026 venues." },
    ],
  }),
  component: OpsPage,
});

const incidents = [
  { id: "INC-2041", type: "Crowd density", zone: "Gate E", level: "medium", owner: "Zone lead E", eta: "T+10m" },
  { id: "INC-2039", type: "Facility (lift)", zone: "E-2", level: "medium", owner: "Facilities", eta: "T+45m" },
  { id: "INC-2035", type: "Lost & found", zone: "Gate C", level: "low", owner: "Guest services", eta: "T+5m" },
];

function OpsPage() {
  return (
    <AppShell title="Operations Center" subtitle="Incident queue, resource coordination and shift orchestration">
      <div className="grid gap-3 md:grid-cols-4">
        <KpiCard label="Open incidents" value="3" delta="1 medium" tone="warn" icon={<ShieldAlert className="h-4 w-4" />} />
        <KpiCard label="Volunteers on shift" value="612" hint="9 zones covered" tone="good" icon={<Users2 className="h-4 w-4" />} />
        <KpiCard label="Maintenance tickets" value="7" delta="2 in progress" tone="default" icon={<Wrench className="h-4 w-4" />} />
        <KpiCard label="Comms channel load" value="41%" tone="good" icon={<Radio className="h-4 w-4" />} />
      </div>

      <div className="mt-6 glass rounded-2xl p-5">
        <SectionHeading eyebrow="Queue" title="Live incident board" />
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="py-2">ID</th>
                <th>Type</th>
                <th>Zone</th>
                <th>Level</th>
                <th>Owner</th>
                <th>Target</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {incidents.map((i) => (
                <tr key={i.id}>
                  <td className="py-2 font-mono text-xs">{i.id}</td>
                  <td>{i.type}</td>
                  <td>{i.zone}</td>
                  <td>
                    <span
                      className={
                        "rounded px-1.5 py-0.5 text-[10px] uppercase " +
                        (i.level === "high"
                          ? "bg-destructive/15 text-destructive"
                          : i.level === "medium"
                          ? "bg-[color:var(--gold)]/15 text-[color:var(--gold)]"
                          : "bg-primary/10 text-primary")
                      }
                    >
                      {i.level}
                    </span>
                  </td>
                  <td>{i.owner}</td>
                  <td className="text-muted-foreground">{i.eta}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  );
}