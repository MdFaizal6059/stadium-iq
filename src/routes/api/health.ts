import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/health")({
  server: {
    handlers: {
      GET: async () => {
        const { apiKeyStatus } = await import("@/lib/ai-gateway.server");
        return Response.json({
          service: "worldcupiq-ai",
          version: "1.0.0",
          status: "ok",
          apis: apiKeyStatus(),
          generatedAt: new Date().toISOString(),
        });
      },
    },
  },
});
