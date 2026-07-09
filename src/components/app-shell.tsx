import { Link, useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";
import {
  LayoutDashboard,
  Sparkles,
  Users2,
  TramFront,
  Accessibility,
  Ticket,
  ShieldAlert,
  MapPinned,
  FileBarChart2,
  Settings2,
  Activity,
  Radar,
} from "lucide-react";

const NAV: Array<{ to: string; label: string; icon: typeof LayoutDashboard; group: string }> = [
  { to: "/dashboard", label: "Executive Command", icon: LayoutDashboard, group: "Intelligence" },
  { to: "/command", label: "AI Command Center", icon: Sparkles, group: "Intelligence" },
  { to: "/crowd", label: "Crowd Intelligence", icon: Users2, group: "Operational" },
  { to: "/transport", label: "Transportation", icon: TramFront, group: "Operational" },
  { to: "/accessibility", label: "Accessibility", icon: Accessibility, group: "Operational" },
  { to: "/fan", label: "Fan Experience", icon: Ticket, group: "Operational" },
  { to: "/operations", label: "Operations", icon: ShieldAlert, group: "Operational" },
  { to: "/maps", label: "Maps", icon: MapPinned, group: "Operational" },
  { to: "/reports", label: "Reports", icon: FileBarChart2, group: "Insights" },
  { to: "/status", label: "API Status", icon: Activity, group: "Insights" },
  { to: "/settings", label: "Settings", icon: Settings2, group: "Insights" },
];

export function AppShell({ children, title, subtitle, actions }: {
  children: ReactNode;
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const groups = Array.from(new Set(NAV.map((n) => n.group)));

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <div className="pointer-events-none fixed inset-0 gradient-pitch opacity-70" aria-hidden />
      <div className="pointer-events-none fixed inset-0 grid-lines opacity-40" aria-hidden />

      <div className="relative flex min-h-dvh">
        <aside className="hidden w-64 shrink-0 border-r border-border/60 bg-sidebar/60 backdrop-blur-md md:flex md:flex-col">
          <Link to="/" className="flex items-center gap-2 px-5 pt-6 pb-4">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-lg shadow-primary/20">
              <Radar className="h-5 w-5" aria-hidden />
            </div>
            <div className="leading-tight">
              <div className="font-display text-sm font-semibold tracking-tight">WorldCupIQ AI</div>
              <div className="text-[11px] text-muted-foreground">Stadium Decision OS</div>
            </div>
          </Link>

          <nav className="mt-2 flex-1 overflow-y-auto px-3 pb-6" aria-label="Primary">
            {groups.map((g) => (
              <div key={g} className="mb-4">
                <div className="px-2 pb-1 text-[10px] font-medium uppercase tracking-widest text-muted-foreground/80">
                  {g}
                </div>
                <ul className="space-y-0.5">
                  {NAV.filter((n) => n.group === g).map((n) => {
                    const active = pathname === n.to;
                    const Icon = n.icon;
                    return (
                      <li key={n.to}>
                        <Link
                          to={n.to}
                          className={
                            "group flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors " +
                            (active
                              ? "bg-primary/15 text-foreground ring-1 ring-primary/25"
                              : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground")
                          }
                        >
                          <Icon className={"h-4 w-4 " + (active ? "text-primary" : "")} aria-hidden />
                          <span>{n.label}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>

          <div className="border-t border-border/60 px-4 py-3 text-[11px] text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-primary" aria-hidden />
              Live signal • FIFA WC 2026 build
            </div>
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          <header className="sticky top-0 z-20 border-b border-border/60 bg-background/70 backdrop-blur-md">
            <div className="flex flex-wrap items-center gap-3 px-5 py-4 md:px-8">
              <div className="min-w-0">
                <h1 className="font-display text-lg font-semibold tracking-tight md:text-xl">{title}</h1>
                {subtitle ? (
                  <p className="text-xs text-muted-foreground md:text-sm">{subtitle}</p>
                ) : null}
              </div>
              <div className="ml-auto flex flex-wrap items-center gap-2">{actions}</div>
            </div>
          </header>
          <div className="px-5 py-6 md:px-8 md:py-8">{children}</div>
        </main>
      </div>
    </div>
  );
}