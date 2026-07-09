# Project structure

```text
src/
  routes/                # File-based TanStack routes
    __root.tsx           # HTML shell + head/meta
    index.tsx            # Landing
    dashboard.tsx        # Executive Command Center
    command.tsx          # AI Command Center (multi-agent)
    crowd.tsx            # Crowd Intelligence
    transport.tsx        # Transportation Intelligence
    accessibility.tsx    # Accessibility Intelligence
    fan.tsx              # Fan Experience Center
    operations.tsx       # Operations Center
    maps.tsx             # Maps Center
    reports.tsx          # Reports Center
    settings.tsx         # Settings
    status.tsx           # API Status
    api/health.ts        # HTTP health endpoint
  components/
    app-shell.tsx        # Sidebar + header layout
    kpi-card.tsx
    decision-card.tsx    # Situation/risk/prediction/options/recommend card
    agent-trace.tsx      # Coordinator + specialists timeline
    confidence-meter.tsx
    section-heading.tsx
  lib/
    ai-gateway.server.ts # Lovable AI Gateway adapter (server-only)
    decision.functions.ts# Decision engine server functions
  styles.css             # Design tokens (dark-first, tournament palette)
docs/
  architecture.md
  deployment.md
  testing.md
  demo_script.md
  colab_guide.md
  google_ai_studio.md
Dockerfile
.env.example
```