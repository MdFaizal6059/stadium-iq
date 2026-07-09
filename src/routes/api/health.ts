import { createFileRoute } from "@tanstack/react-router";
import { apiKeyStatus } from "@/lib/ai-gateway.server";

export const Route = createFileRoute("/api/health")({
  server: {
    handlers: {
      GET: async () =>
        Response.json({
          service: "worldcupiq-ai",
          version: "1.0.0",
          status: "ok",
          apis: apiKeyStatus(),
          generatedAt: new Date().toISOString(),
        }),
    },
  },
});