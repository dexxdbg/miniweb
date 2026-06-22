import { describe, it, expect } from "vitest";
import { cn } from "./utils";

describe("cn (tailwind-merge + clsx)", () => {
  it("merges class strings", () => {
    expect(cn("px-2", "py-1")).toBe("px-2 py-1");
  });

  it("resolves conflicting tailwind classes (last wins)", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
  });

  it("handles conditional values", () => {
    expect(cn("base", false && "hidden", "extra")).toBe("base extra");
  });

  it("handles undefined / null inputs gracefully", () => {
    expect(cn(undefined, null, "ok")).toBe("ok");
  });

  it("handles array inputs", () => {
    expect(cn(["a", "b"], "c")).toBe("a b c");
  });

  it("returns empty string for no inputs", () => {
    expect(cn()).toBe("");
  });

  it("deduplicates identical classes", () => {
    expect(cn("text-red-500", "text-red-500")).toBe("text-red-500");
  });
});
