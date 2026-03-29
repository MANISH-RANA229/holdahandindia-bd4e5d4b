/**
 * Tests for seriousness/consistency helper functions.
 * Validates activity status & seriousness level classification logic.
 */
import { describe, it, expect } from "vitest";
import {
  getActivityStatus,
  getSeriousnessLevel,
  SeriousnessRecord,
} from "../seriousnessData";

const makeRecord = (overrides: Partial<SeriousnessRecord>): SeriousnessRecord => ({
  studentId: "test",
  attendanceRate: 80,
  missedSessions: 2,
  consistencyScore: 75,
  lastActiveDaysAgo: 1,
  ...overrides,
});

describe("getActivityStatus", () => {
  it('returns "Active" for recent & consistent students', () => {
    expect(getActivityStatus(makeRecord({ lastActiveDaysAgo: 0, consistencyScore: 85 }))).toBe("Active");
  });

  it('returns "Irregular" for moderately active students', () => {
    expect(getActivityStatus(makeRecord({ lastActiveDaysAgo: 5, consistencyScore: 50 }))).toBe("Irregular");
  });

  it('returns "Inactive" for disengaged students', () => {
    expect(getActivityStatus(makeRecord({ lastActiveDaysAgo: 10, consistencyScore: 30 }))).toBe("Inactive");
  });

  it('returns "Irregular" when consistency is below 70 but active recently', () => {
    expect(getActivityStatus(makeRecord({ lastActiveDaysAgo: 1, consistencyScore: 50 }))).toBe("Irregular");
  });
});

describe("getSeriousnessLevel", () => {
  it('returns "high" when average of attendance & consistency >= 70', () => {
    expect(getSeriousnessLevel(makeRecord({ attendanceRate: 90, consistencyScore: 85 }))).toBe("high");
  });

  it('returns "medium" when average is between 45 and 69', () => {
    expect(getSeriousnessLevel(makeRecord({ attendanceRate: 60, consistencyScore: 50 }))).toBe("medium");
  });

  it('returns "low" when average is below 45', () => {
    expect(getSeriousnessLevel(makeRecord({ attendanceRate: 30, consistencyScore: 20 }))).toBe("low");
  });
});
