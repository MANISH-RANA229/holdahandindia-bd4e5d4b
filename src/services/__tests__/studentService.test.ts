/**
 * Tests for studentService — static data mode.
 * Mocking is prepared so switching to API mode is straightforward.
 */
import { describe, it, expect, vi } from "vitest";
import { studentService } from "../studentService";
import { students } from "@/data/students";

// Ensure we're in static data mode (default)
vi.mock("../apiConfig", () => ({
  API_CONFIG: { USE_STATIC_DATA: true, BASE_URL: "", TIMEOUT: 10000 },
  ENDPOINTS: {
    STUDENTS: {
      LIST: "/students",
      BY_ID: (id: string) => `/students/${id}`,
    },
    MENTORS: {
      STUDENTS: (id: string) => `/mentors/${id}/students`,
    },
  },
}));

describe("studentService (static data)", () => {
  it("getAll returns all students", async () => {
    const result = await studentService.getAll();
    expect(result).toEqual(students);
    expect(result.length).toBeGreaterThan(0);
  });

  it("getById returns the correct student", async () => {
    const student = await studentService.getById("s1");
    expect(student).not.toBeNull();
    expect(student!.name).toBe("Anita Devi");
  });

  it("getById returns null for unknown id", async () => {
    const student = await studentService.getById("unknown");
    expect(student).toBeNull();
  });

  it("getByMentor returns students assigned to a mentor", async () => {
    const result = await studentService.getByMentor("m1");
    expect(result.every((s) => s.assignedMentorId === "m1")).toBe(true);
  });

  it("getByMentor returns empty array when no students match", async () => {
    const result = await studentService.getByMentor("nonexistent");
    expect(result).toEqual([]);
  });
});
