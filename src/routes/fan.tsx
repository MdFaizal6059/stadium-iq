import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { KpiCard } from "@/components/kpi-card";
import { SectionHeading } from "@/components/section-heading";
import { Ticket, Utensils, Languages, MapPinned } from "lucide-react";

export const Route = createFileRoute("/fan")({
  head: () => ({
    meta: [
      { title: "Fan Experience Center · WorldCupIQ AI" },
      { name: "description", content: "Fan wayfinding, food discovery, multilingual guidance and personalized experience recommendations." },
    ],
  }),
  component: FanPage,
});

function FanPage() {
  return (
    <AppShell title="Fan Experience Center" subtitle="Wayfinding, food, multilingual guidance and personalized moments">
      <div className="grid gap-3 md:grid-cols-4">
        <KpiCard label="Fans assisted today" value="18,204" delta="+9% vs baseline" tone="good" icon={<Ticket className="h-4 w-4" />} />
        <KpiCard label="F&B wait avg." value="6m 08s" tone="good" icon={<Utensils className="h-4 w-4" />} />
        <KpiCard label="Languages served" value="12" hint="Ar · En · Es · Fr · Pt · …" icon={<Languages className="h-4 w-4" />} />
        <KpiCard label="Navigation queries" value="41,912" tone="default" icon={<MapPinned className="h-4 w-4" />} />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <div className="glass lg:col-span-2 rounded-2xl p-5">
          <SectionHeading eyebrow="Nearby" title="What's close to Section 118" />
          <ul className="grid gap-2 md:grid-cols-2">
            {[
              { label: "Halal grill counter", meta: "2 min · avg. 4m wait" },
              { label: "Vegetarian bowl bar", meta: "3 min · avg. 2m wait" },
              { label: "Prayer room (male / female)", meta: "5 min · Zone S" },
              { label: "Family restroom", meta: "1 min · N-2" },
              { label: "First-aid post", meta: "2 min · staffed" },
              { label: "Multilingual info desk", meta: "3 min · 8 languages" },
            ].map((i, k) => (
              <li key={k} className="rounded-xl border border-border/60 bg-card/40 p-3 text-sm">
                <div className="font-medium">{i.label}</div>
                <div className="text-xs text-muted-foreground">{i.meta}</div>
              </li>
            ))}
          </ul>
        </div>
        <div className="glass rounded-2xl p-5">
          <SectionHeading eyebrow="Assistant" title="Fan agent quick actions" />
          <ul className="space-y-2 text-sm">
            <li className="rounded-lg border border-primary/25 bg-primary/8 p-3">Get me to my seat, step-free.</li>
            <li className="rounded-lg border border-border/60 bg-card/40 p-3">Best exit strategy for this match.</li>
            <li className="rounded-lg border border-border/60 bg-card/40 p-3">Translate this sign into Arabic.</li>
            <li className="rounded-lg border border-border/60 bg-card/40 p-3">Where can I refill my water bottle?</li>
          </ul>
        </div>
      </div>
    </AppShell>
  );
}