import { describe, it, expect } from "vitest";
import { ALLOWED_MODELS, DecisionInput } from "./decision.functions";

describe("DecisionInput schema", () => {
  it("accepts a minimal valid payload", () => {
    const parsed = DecisionInput.parse({ query: "Crowd density rising at Gate E" });
    expect(parsed.persona).toBe("operations");
  });
  it("rejects too-short queries", () => {
    expect(() => DecisionInput.parse({ query: "hi" })).toThrow();
  });
  it("rejects unknown personas", () => {
    expect(() => DecisionInput.parse({ query: "valid query text", persona: "hacker" })).toThrow();
  });
  it("rejects models outside the Gemini allowlist", () => {
    expect(() =>
      DecisionInput.parse({ query: "valid query text", model: "openai/gpt-5" }),
    ).toThrow();
  });
  it("accepts every allowlisted Gemini model", () => {
    for (const m of ALLOWED_MODELS) {
      expect(DecisionInput.parse({ query: "valid query text", model: m }).model).toBe(m);
    }
  });
});
