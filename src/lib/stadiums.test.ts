import { describe, it, expect } from "vitest";
import { HOST_STADIUMS, getStadium, liveMetricsFor, project } from "./stadiums";

describe("HOST_STADIUMS", () => {
  it("contains all 16 official FIFA World Cup 2026 host stadiums", () => {
    expect(HOST_STADIUMS).toHaveLength(16);
  });

  it("covers all three host countries", () => {
    const countries = new Set(HOST_STADIUMS.map((s) => s.country));
    expect(countries).toEqual(new Set(["USA", "Canada", "Mexico"]));
  });

  it("has 11 USA, 2 Canada and 3 Mexico venues", () => {
    const by = (c: string) => HOST_STADIUMS.filter((s) => s.country === c).length;
    expect(by("USA")).toBe(11);
    expect(by("Canada")).toBe(2);
    expect(by("Mexico")).toBe(3);
  });

  it("gives each stadium a unique id", () => {
    const ids = HOST_STADIUMS.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("stores plausible capacities and coordinates", () => {
    for (const s of HOST_STADIUMS) {
      expect(s.capacity).toBeGreaterThan(40000);
      expect(s.lat).toBeGreaterThan(15);
      expect(s.lat).toBeLessThan(55);
      expect(s.lng).toBeGreaterThan(-125);
      expect(s.lng).toBeLessThan(-75);
    }
  });
});

describe("getStadium", () => {
  it("returns the exact stadium by id", () => {
    expect(getStadium("la").city).toBe("Los Angeles");
  });
  it("falls back to the first stadium for unknown ids", () => {
    expect(getStadium("does-not-exist").id).toBe(HOST_STADIUMS[0].id);
  });
});

describe("liveMetricsFor", () => {
  it("is deterministic for a fixed tick and returns bounded values", () => {
    const a = liveMetricsFor(HOST_STADIUMS[0], 42);
    const b = liveMetricsFor(HOST_STADIUMS[0], 42);
    expect(a).toEqual(b);
    expect(a.attendance).toBeLessThanOrEqual(HOST_STADIUMS[0].capacity);
    expect(a.density).toBeGreaterThanOrEqual(0);
    expect(a.density).toBeLessThanOrEqual(100);
    expect(["Low", "Moderate", "Elevated", "High"]).toContain(a.riskLevel);
  });
});

describe("project", () => {
  it("projects lat/lng into the given viewport", () => {
    const p = project(40, -100, 1000, 500);
    expect(p.x).toBeGreaterThan(0);
    expect(p.x).toBeLessThan(1000);
    expect(p.y).toBeGreaterThan(0);
    expect(p.y).toBeLessThan(500);
  });
});