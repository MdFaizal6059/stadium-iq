import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { AgentTraceList } from "./agent-trace";

const agents = [
  { id: "a", name: "Coordinator", role: "Routes intent", status: "ok" as const, latencyMs: 120, notes: "Routed ok" },
  { id: "b", name: "Crowd", role: "Density", status: "error" as const, latencyMs: 210, notes: "Signal degraded" },
  { id: "c", name: "Reporting", role: "Brief", status: "skipped" as const, latencyMs: 40, notes: "Not needed" },
];

describe("AgentTraceList", () => {
  it("renders one entry per agent with name, notes and latency", () => {
    render(<AgentTraceList agents={agents} />);
    for (const a of agents) {
      expect(screen.getByText(a.name)).toBeInTheDocument();
      expect(screen.getByText(a.notes)).toBeInTheDocument();
      expect(screen.getByText(`${a.latencyMs} ms`)).toBeInTheDocument();
    }
  });
});