import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Sparkles,
  Radar,
  Users2,
  TramFront,
  Accessibility,
  ShieldAlert,
  Leaf,
  BrainCircuit,
  MapPinned,
  Target,
  BarChart3,
  Languages,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "WorldCupIQ AI — Stadium Decision Intelligence for FIFA World Cup 2026" },
      {
        name: "description",
        content:
          "The Stadium Decision Intelligence Operating System for FIFA World Cup 2026: multi-agent GenAI turns crowd, transport, accessibility and venue signals into actionable decisions.",
      },
    ],
  }),
  component: Landing,
});

const AGENTS = [
  { icon: Users2, name: "Crowd Intelligence", note: "Density, flow, anomalies." },
  { icon: TramFront, name: "Transportation", note: "Multimodal ETAs & disruptions." },
  { icon: Accessibility, name: "Accessibility", note: "Step-free & assisted paths." },
  { icon: Leaf, name: "Sustainability", note: "Emissions-aware decisions." },
  { icon: ShieldAlert, name: "Operations", note: "Staffing & escalation." },
  { icon: MapPinned, name: "Navigation", note: "Route optimization." },
  { icon: Languages, name: "Fan Experience", note: "Multilingual, wayfinding." },
  { icon: Target, name: "Recommendation", note: "Ranked courses of action." },
];

const PILLARS = [
  {
    icon: BrainCircuit,
    title: "Decision Intelligence, not Q&A",
    body: "Every interaction returns situation, risk, prediction, options, recommendation, impact and confidence — never a paragraph of prose.",
  },
  {
    icon: Radar,
    title: "Multi-agent GenAI core",
    body: "A coordinator orchestrates a roster of specialist agents built on Gemini reasoning, with a visible per-request trace.",
  },
  {
    icon: BarChart3,
    title: "Grounded on tournament knowledge",
    body: "RAG over venue guides, transport plans, accessibility protocols and emergency procedures with source citations and confidence.",
  },
];

function Landing() {
  return (
    <div className="relative min-h-dvh overflow-hidden bg-background text-foreground dark">
      <div className="pointer-events-none absolute inset-0 gradient-pitch opacity-90" aria-hidden />
      <div className="pointer-events-none absolute inset-0 grid-lines opacity-30" aria-hidden />

      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-lg shadow-primary/20">
            <Radar className="h-5 w-5" aria-hidden />
          </div>
          <div className="leading-tight">
            <div className="font-display text-sm font-semibold tracking-tight">WorldCupIQ AI</div>
            <div className="text-[11px] text-muted-foreground">Stadium Decision OS</div>
          </div>
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex" aria-label="Primary">
          <a href="#pillars" className="hover:text-foreground">Platform</a>
          <a href="#agents" className="hover:text-foreground">Agents</a>
          <a href="#modules" className="hover:text-foreground">Modules</a>
          <a href="#stack" className="hover:text-foreground">Stack</a>
        </nav>
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground shadow shadow-primary/25 transition hover:opacity-90"
        >
          Open Console <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </header>

      <section className="relative z-10 mx-auto max-w-7xl px-6 pt-10 pb-16 md:pt-16 md:pb-24">
        <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-[11px] font-medium uppercase tracking-widest text-primary">
          <Sparkles className="h-3 w-3" aria-hidden /> FIFA World Cup 2026 · Decision Intelligence OS
        </div>
        <h1 className="font-display text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl">
          The <span className="gradient-text">Stadium Decision</span>
          <br /> Intelligence OS for World Cup 2026.
        </h1>
        <p className="mt-5 max-w-2xl text-base text-muted-foreground md:text-lg">
          WorldCupIQ AI turns crowd, transportation, accessibility, venue and tournament signals into
          real-time <span className="text-foreground">actionable decisions</span> — with situation
          awareness, predicted outcomes, ranked options and a confidence score. Built for organizers,
          operations, volunteers, staff and fans.
        </p>
        <div className="mt-7 flex flex-wrap items-center gap-3">
          <Link
            to="/command"
            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition hover:opacity-90"
          >
            Try the AI Command Center <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1.5 rounded-md border border-border/70 bg-background/50 px-4 py-2.5 text-sm font-medium hover:bg-background/80"
          >
            View executive dashboard
          </Link>
        </div>

        <div className="mt-14 grid gap-4 md:grid-cols-3" id="pillars">
          {PILLARS.map((p, i) => (
            <div key={i} className="glass rounded-2xl p-5">
              <p.icon className="mb-3 h-5 w-5 text-primary" aria-hidden />
              <div className="font-display text-lg font-semibold tracking-tight">{p.title}</div>
              <p className="mt-1 text-sm text-muted-foreground">{p.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="agents" className="relative z-10 mx-auto max-w-7xl px-6 pb-16">
        <div className="mb-6">
          <div className="text-[11px] font-medium uppercase tracking-widest text-primary">Agent roster</div>
          <h2 className="font-display text-2xl font-semibold tracking-tight md:text-3xl">A coordinator over 8 specialist agents</h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
          {AGENTS.map((a) => (
            <div key={a.name} className="rounded-xl border border-border/60 bg-card/40 p-4">
              <a.icon className="mb-2 h-5 w-5 text-primary" aria-hidden />
              <div className="text-sm font-medium">{a.name}</div>
              <div className="text-xs text-muted-foreground">{a.note}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="modules" className="relative z-10 mx-auto max-w-7xl px-6 pb-16">
        <div className="glass grid gap-6 rounded-3xl p-6 md:grid-cols-3 md:p-10">
          <div className="md:col-span-1">
            <div className="text-[11px] font-medium uppercase tracking-widest text-primary">
              Intelligence modules
            </div>
            <h2 className="font-display text-2xl font-semibold tracking-tight md:text-3xl">
              Nine command centers, one operating system.
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Crowd. Transportation. Accessibility. Fan Experience. Operations. Risk. Emergency.
              Sustainability. Executive Command. Each module rolls up into decisions, not dashboards
              that just watch.
            </p>
          </div>
          <ul className="md:col-span-2 grid gap-2 md:grid-cols-2">
            {[
              "Executive Command Center",
              "Crowd Intelligence Center",
              "Transportation Intelligence",
              "Accessibility Intelligence",
              "Fan Experience Center",
              "Operations Intelligence",
              "Risk Monitoring Center",
              "Emergency Support Center",
              "Sustainability Intelligence",
            ].map((m) => (
              <li key={m} className="rounded-lg border border-border/60 bg-background/40 px-3 py-2 text-sm">
                {m}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="stack" className="relative z-10 mx-auto max-w-7xl px-6 pb-24">
        <div className="rounded-2xl border border-border/60 bg-card/40 p-6 md:p-8">
          <div className="text-[11px] font-medium uppercase tracking-widest text-primary">Under the hood</div>
          <h2 className="font-display text-2xl font-semibold tracking-tight md:text-3xl">Purpose-built for the challenge.</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-4">
            {[
              { k: "GEMINI_API_KEY", v: "Reasoning, coordination, decisions" },
              { k: "SEARCH_API_KEY", v: "Real-time event intelligence" },
              { k: "AIMODE_API_KEY", v: "Deep information retrieval" },
              { k: "LOCAL_API_KEY", v: "Nearby facilities & services" },
              { k: "MAPS_API_KEY", v: "Navigation & geospatial intelligence" },
              { k: "RAG", v: "PDF · CSV · TXT knowledge grounding" },
              { k: "Multi-agent", v: "Coordinator + 8 specialist agents" },
              { k: "Responsible AI", v: "Sources · confidence · limitations" },
            ].map((s) => (
              <div key={s.k} className="rounded-xl border border-border/60 bg-background/30 p-3">
                <div className="text-[11px] font-mono uppercase tracking-wider text-primary">{s.k}</div>
                <div className="text-sm">{s.v}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="relative z-10 border-t border-border/60">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-6 text-xs text-muted-foreground">
          <div>© 2026 WorldCupIQ AI · Built for the FIFA World Cup 2026 challenge.</div>
          <div className="flex items-center gap-4">
            <Link to="/status" className="hover:text-foreground">API Status</Link>
            <Link to="/settings" className="hover:text-foreground">Settings</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
