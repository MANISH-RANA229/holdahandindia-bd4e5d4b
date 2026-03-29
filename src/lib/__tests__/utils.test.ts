/**
 * Tests for the cn() utility function.
 * Verifies Tailwind class merging and conditional class composition.
 */
import { describe, it, expect } from "vitest";
import { cn } from "../utils";

describe("cn — class name utility", () => {
  it("merges multiple class strings", () => {
    expect(cn("px-4", "py-2")).toBe("px-4 py-2");
  });

  it("resolves Tailwind conflicts (last wins)", () => {
    // tailwind-merge should drop the first px value
    expect(cn("px-4", "px-8")).toBe("px-8");
  });

  it("handles conditional classes via clsx", () => {
    const isActive = true;
    const result = cn("base", isActive && "active", !isActive && "inactive");
    expect(result).toBe("base active");
  });

  it("handles undefined and null inputs gracefully", () => {
    expect(cn("text-sm", undefined, null, "font-bold")).toBe("text-sm font-bold");
  });

  it("returns empty string for no inputs", () => {
    expect(cn()).toBe("");
  });
});
