import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { KpiCard } from "@/components/kpi-card";
import { SectionHeading } from "@/components/section-heading";
import { Accessibility, Ear, Eye, HeartHandshake } from "lucide-react";

export const Route = createFileRoute("/accessibility")({
  head: () => ({
    meta: [
      { title: "Accessibility Center · WorldCupIQ AI" },
      { name: "description", content: "Step-free routing, assisted services and accessibility resources for FIFA World Cup 2026 venues." },
    ],
  }),
  component: AccessibilityPage,
});

const services = [
  { icon: Accessibility, label: "Wheelchair loans", value: "42 available", desk: "N-2, S-1, E-3" },
  { icon: Ear, label: "Hearing assistance", value: "12 kits deployed", desk: "Info desks all zones" },
  { icon: Eye, label: "Visual guides", value: "24 volunteers on shift", desk: "Meet at Gate A / D" },
  { icon: HeartHandshake, label: "Companion support", value: "On-request", desk: "Call center · 24/7" },
];

const routes = [
  { from: "South Plaza", to: "Section 118", steps: 0, eta: "8 min", surface: "smooth", status: "clear" },
  { from: "Metro Exit 4", to: "Gate D lounge", steps: 0, eta: "6 min", surface: "smooth", status: "clear" },
  { from: "North Drop-off", to: "Section 224", steps: 0, eta: "11 min", surface: "tactile", status: "watch" },
];

function AccessibilityPage() {
  return (
    <AppShell title="Accessibility Intelligence" subtitle="Step-free routes, assisted services and inclusive fan support">
      <div className="grid gap-3 md:grid-cols-4">
        <KpiCard label="Accessible route uptime" value="100%" tone="good" />
        <KpiCard label="Support desks staffed" value="12 / 12" tone="good" />
        <KpiCard label="Requests handled today" value="317" delta="avg. 3m 12s response" tone="good" />
        <KpiCard label="Escalations open" value="1" hint="wheelchair lift E-2 maintenance" tone="warn" />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="glass rounded-2xl p-5">
          <SectionHeading eyebrow="Routes" title="Verified step-free paths" />
          <ul className="space-y-2 text-sm">
            {routes.map((r, i) => (
              <li key={i} className="rounded-xl border border-border/60 bg-card/40 p-3">
                <div className="flex items-center justify-between">
                  <div className="font-medium">{r.from} → {r.to}</div>
                  <span className={"rounded px-1.5 py-0.5 text-[10px] uppercase " + (r.status === "clear" ? "bg-primary/10 text-primary" : "bg-[color:var(--gold)]/15 text-[color:var(--gold)]")}>{r.status}</span>
                </div>
                <div className="text-xs text-muted-foreground">Steps {r.steps} · ETA {r.eta} · surface {r.surface}</div>
              </li>
            ))}
          </ul>
        </div>
        <div className="glass rounded-2xl p-5">
          <SectionHeading eyebrow="Services" title="Assisted resources" />
          <ul className="space-y-2 text-sm">
            {services.map((s, i) => (
              <li key={i} className="flex items-start gap-3 rounded-xl border border-border/60 bg-card/40 p-3">
                <s.icon className="h-5 w-5 text-primary" aria-hidden />
                <div>
                  <div className="font-medium">{s.label}</div>
                  <div className="text-xs text-muted-foreground">{s.value} · {s.desk}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </AppShell>
  );
}