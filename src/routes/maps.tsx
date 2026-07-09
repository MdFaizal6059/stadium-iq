import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { SectionHeading } from "@/components/section-heading";
import { MapPinned, Layers, Accessibility, Bus } from "lucide-react";

export const Route = createFileRoute("/maps")({
  head: () => ({
    meta: [
      { title: "Maps · WorldCupIQ AI" },
      { name: "description", content: "Interactive stadium and city maps with routes, accessibility layers and points of interest." },
    ],
  }),
  component: MapsPage,
});

function MapsPage() {
  return (
    <AppShell title="Maps Center" subtitle="Interactive stadium & city maps with accessible routing and layered points of interest">
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
              <li key={i} className="flex items-center gap-2 rounded-md border border-border/60 bg-card/40 p-2">
                <l.icon className="h-4 w-4 text-primary" aria-hidden />
                <span className="flex-1">{l.label}</span>
                <input type="checkbox" defaultChecked className="accent-[var(--primary)]" aria-label={l.label} />
              </li>
            ))}
          </ul>
        </aside>

        <div className="glass relative overflow-hidden rounded-2xl lg:col-span-3">
          <div className="relative h-[420px] w-full">
            <div className="absolute inset-0 grid-lines opacity-40" aria-hidden />
            <svg
              viewBox="0 0 800 420"
              className="absolute inset-0 h-full w-full"
              role="img"
              aria-label="Stylized stadium and campus map showing gates, transit lines and points of interest"
            >
              <defs>
                <radialGradient id="pitch" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
                </radialGradient>
              </defs>
              <ellipse cx="400" cy="210" rx="220" ry="130" fill="url(#pitch)" />
              <ellipse cx="400" cy="210" rx="150" ry="80" fill="none" stroke="var(--primary)" strokeWidth="2" opacity="0.9" />
              <rect x="380" y="190" width="40" height="40" fill="none" stroke="var(--primary)" strokeWidth="1.2" opacity="0.8" />
              {[
                { x: 180, y: 100, l: "Gate A" },
                { x: 620, y: 100, l: "Gate B" },
                { x: 180, y: 320, l: "Gate C" },
                { x: 620, y: 320, l: "Gate D" },
                { x: 400, y: 60, l: "Gate E" },
              ].map((g) => (
                <g key={g.l}>
                  <circle cx={g.x} cy={g.y} r="10" fill="var(--gold)" />
                  <text x={g.x + 14} y={g.y + 4} fill="var(--foreground)" fontSize="11">
                    {g.l}
                  </text>
                </g>
              ))}
              <path d="M60 210 L180 210 L180 100" stroke="var(--chart-3)" strokeWidth="2" fill="none" strokeDasharray="4 4" />
              <path d="M740 210 L620 210 L620 320" stroke="var(--chart-3)" strokeWidth="2" fill="none" strokeDasharray="4 4" />
              <text x="20" y="204" fill="var(--muted-foreground)" fontSize="11">Metro</text>
              <text x="700" y="204" fill="var(--muted-foreground)" fontSize="11">Bus</text>
            </svg>
            <div className="absolute bottom-3 left-3 rounded-md bg-background/70 px-2 py-1 text-[11px] text-muted-foreground backdrop-blur">
              Stylized map · connect MAPS_API_KEY for live tiles
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}