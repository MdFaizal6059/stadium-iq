import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { SectionHeading } from "@/components/section-heading";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings · WorldCupIQ AI" },
      {
        name: "description",
        content:
          "Configure personas, language, theme and knowledge sources for the WorldCupIQ AI Decision OS.",
      },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  return (
    <AppShell title="Settings" subtitle="Persona, language, theme and knowledge sources">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="glass rounded-2xl p-5">
          <SectionHeading eyebrow="Persona" title="Default persona mode" />
          <div className="flex flex-wrap gap-2">
            {["Operations", "Fan", "Volunteer", "Venue staff", "Accessibility"].map((p) => (
              <span
                key={p}
                className="rounded-full border border-border/60 bg-card/40 px-3 py-1 text-sm"
              >
                {p}
              </span>
            ))}
          </div>
        </div>
        <div className="glass rounded-2xl p-5">
          <SectionHeading eyebrow="Localization" title="Preferred language" />
          <div className="flex flex-wrap gap-2">
            {["English", "العربية", "Español", "Français", "Português", "日本語"].map((l) => (
              <span
                key={l}
                className="rounded-full border border-border/60 bg-card/40 px-3 py-1 text-sm"
              >
                {l}
              </span>
            ))}
          </div>
        </div>
        <div className="glass rounded-2xl p-5 md:col-span-2">
          <SectionHeading
            eyebrow="Knowledge"
            title="RAG knowledge sources"
            description="PDF · CSV · TXT · venue guides · transport data · accessibility protocols · emergency procedures"
          />
          <ul className="grid gap-2 md:grid-cols-2">
            {[
              "Stadium Operations Manual (PDF)",
              "Transportation Master Plan (PDF)",
              "Accessibility Services Directory (CSV)",
              "Emergency Response Playbook (PDF)",
              "Volunteer Runbook (TXT)",
              "Tournament Policy Compendium (PDF)",
            ].map((k) => (
              <li
                key={k}
                className="flex items-center justify-between rounded-lg border border-border/60 bg-card/40 p-3 text-sm"
              >
                <span>{k}</span>
                <span className="text-xs text-primary">Indexed</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </AppShell>
  );
}
