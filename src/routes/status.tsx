import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { AppShell } from "@/components/app-shell";
import { SectionHeading } from "@/components/section-heading";
import { CheckCircle2, XCircle } from "lucide-react";
import { getApiStatus } from "@/lib/decision.functions";

type ApiStatus = {
  gemini: boolean;
  search: boolean;
  aimode: boolean;
  local: boolean;
  maps: boolean;
  generatedAt: string;
};

export const Route = createFileRoute("/status")({
  head: () => ({
    meta: [
      { title: "API Status · WorldCupIQ AI" },
      { name: "description", content: "Live status of the five required APIs powering WorldCupIQ AI: Gemini, Search, AI Mode, Local and Maps." },
    ],
  }),
  component: StatusPage,
});

const APIS: Array<{ key: keyof ApiStatus; env: string; role: string }> = [
  { key: "gemini", env: "GEMINI_API_KEY", role: "Reasoning · agent coordination · decisions" },
  { key: "search", env: "SEARCH_API_KEY", role: "Real-time event intelligence" },
  { key: "aimode", env: "AIMODE_API_KEY", role: "Deep information retrieval" },
  { key: "local", env: "LOCAL_API_KEY", role: "Nearby facilities & services" },
  { key: "maps", env: "MAPS_API_KEY", role: "Navigation & geospatial intelligence" },
];

function StatusPage() {
  const getStatus = useServerFn(getApiStatus);
  const { data, isLoading } = useQuery<ApiStatus>({
    queryKey: ["api-status"],
    queryFn: () => getStatus() as unknown as Promise<ApiStatus>,
    refetchInterval: 15_000,
  });

  return (
    <AppShell title="API Status" subtitle="Live probe of the five required API surfaces">
      <SectionHeading eyebrow="Health" title="Configured API keys" description="Configured = the environment variable is present at runtime." />
      <ul className="space-y-2">
        {APIS.map((a) => {
          const ok = !isLoading && data ? Boolean(data[a.key]) : false;
          return (
            <li key={a.env} className="glass flex flex-wrap items-center gap-3 rounded-xl p-4">
              {ok ? (
                <CheckCircle2 className="h-5 w-5 text-primary" aria-hidden />
              ) : (
                <XCircle className="h-5 w-5 text-destructive" aria-hidden />
              )}
              <div className="min-w-0 flex-1">
                <div className="font-mono text-sm">{a.env}</div>
                <div className="text-xs text-muted-foreground">{a.role}</div>
              </div>
              <span
                className={
                  "rounded-full px-2 py-0.5 text-[11px] uppercase tracking-wider " +
                  (ok ? "bg-primary/10 text-primary ring-1 ring-primary/25" : "bg-destructive/10 text-destructive ring-1 ring-destructive/25")
                }
              >
                {ok ? "configured" : "missing"}
              </span>
            </li>
          );
        })}
      </ul>
      <p className="mt-4 text-xs text-muted-foreground">
        Inside Lovable, model traffic is routed via <code>LOVABLE_API_KEY</code>, which also satisfies the
        <code> GEMINI_API_KEY</code> role. On Cloud Run / Colab deployments, provide the challenge-specified
        variables directly.
      </p>
    </AppShell>
  );
}