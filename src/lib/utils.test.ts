import { describe, it, expect } from "vitest";
import { cn } from "./utils";

describe("cn", () => {
  it("joins truthy class names", () => {
    expect(cn("a", "b")).toBe("a b");
  });
  it("skips falsy values", () => {
    const includeB = false;
    expect(cn("a", includeB && "b", null, undefined, "c")).toBe("a c");
  });
  it("dedupes conflicting tailwind classes via twMerge", () => {
    expect(cn("p-2", "p-4")).toBe("p-4");
  });
});
