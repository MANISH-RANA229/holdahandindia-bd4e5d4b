/**
 * Tests for API config — endpoint declarations & structure.
 */
import { describe, it, expect } from "vitest";
import { API_CONFIG, ENDPOINTS } from "../apiConfig";

describe("API_CONFIG", () => {
  it("defaults to static data mode", () => {
    expect(API_CONFIG.USE_STATIC_DATA).toBe(true);
  });

  it("has a timeout configured", () => {
    expect(API_CONFIG.TIMEOUT).toBeGreaterThan(0);
  });
});

describe("ENDPOINTS", () => {
  it("generates dynamic student endpoint", () => {
    expect(ENDPOINTS.STUDENTS.BY_ID("s1")).toBe("/students/s1");
  });

  it("generates dynamic mentor students endpoint", () => {
    expect(ENDPOINTS.MENTORS.STUDENTS("m1")).toBe("/mentors/m1/students");
  });

  it("generates dynamic session toggle-save endpoint", () => {
    expect(ENDPOINTS.SESSIONS.TOGGLE_SAVE("sess1")).toBe("/sessions/sess1/toggle-save");
  });

  it("generates conversation endpoint with both user IDs", () => {
    expect(ENDPOINTS.MESSAGES.CONVERSATION("u1", "u2")).toBe("/messages/u1/u2");
  });
});
