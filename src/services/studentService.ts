import { API_CONFIG, ENDPOINTS } from "./apiConfig";
import { httpClient } from "./httpClient";
import { Student } from "@/data/types";
import { students as staticStudents } from "@/data/students";

export const studentService = {
  async getAll(): Promise<Student[]> {
    if (API_CONFIG.USE_STATIC_DATA) return staticStudents;
    const res = await httpClient.get<Student[]>(ENDPOINTS.STUDENTS.LIST);
    return res.data;
  },

  async getById(id: string): Promise<Student | null> {
    if (API_CONFIG.USE_STATIC_DATA) {
      return staticStudents.find((s) => s.id === id) ?? null;
    }
    const res = await httpClient.get<Student>(ENDPOINTS.STUDENTS.BY_ID(id));
    return res.data;
  },

  async getByMentor(mentorId: string): Promise<Student[]> {
    if (API_CONFIG.USE_STATIC_DATA) {
      return staticStudents.filter((s) => s.assignedMentorId === mentorId);
    }
    const res = await httpClient.get<Student[]>(ENDPOINTS.MENTORS.STUDENTS(mentorId));
    return res.data;
  },
};
