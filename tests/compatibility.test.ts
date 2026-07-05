import { describe, expect, it } from "vitest";
import {
  compareSemver,
  requirementMeetsMinimum,
} from "../src/compatibility.js";

describe("compatibility semver", () => {
  it("compares versions numerically", () => {
    expect(compareSemver([1, 2, 0], [1, 0, 0])).toBeGreaterThan(0);
    expect(compareSemver([1, 0, 0], [1, 2, 0])).toBeLessThan(0);
    expect(compareSemver([1, 0, 0], [1, 0, 0])).toBe(0);
  });

  it("accepts stricter declared requirements", () => {
    expect(requirementMeetsMinimum(">=1.2.0", ">=1.0.0")).toBe(true);
    expect(requirementMeetsMinimum(">=1.0.0", ">=1.0.0")).toBe(true);
  });

  it("rejects requirements below matrix minimum", () => {
    expect(requirementMeetsMinimum(">=0.9.0", ">=1.0.0")).toBe(false);
  });
});
