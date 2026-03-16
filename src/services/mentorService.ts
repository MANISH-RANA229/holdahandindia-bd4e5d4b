import { API_CONFIG, ENDPOINTS } from "./apiConfig";
import { httpClient } from "./httpClient";
import { Mentor } from "@/data/types";
import { mentors as staticMentors } from "@/data/mentors";

export const mentorService = {
  async getAll(): Promise<Mentor[]> {
    if (API_CONFIG.USE_STATIC_DATA) return staticMentors;
    const res = await httpClient.get<Mentor[]>(ENDPOINTS.MENTORS.LIST);
    return res.data;
  },

  async getById(id: string): Promise<Mentor | null> {
    if (API_CONFIG.USE_STATIC_DATA) {
      return staticMentors.find((m) => m.id === id) ?? null;
    }
    const res = await httpClient.get<Mentor>(ENDPOINTS.MENTORS.BY_ID(id));
    return res.data;
  },

  async selectStudent(mentorId: string, studentId: string): Promise<void> {
    if (API_CONFIG.USE_STATIC_DATA) return;
    await httpClient.post(ENDPOINTS.MENTORS.SELECT_STUDENT(mentorId), {
      body: { studentId },
    });
  },

  async deselectStudent(mentorId: string, studentId: string): Promise<void> {
    if (API_CONFIG.USE_STATIC_DATA) return;
    await httpClient.post(ENDPOINTS.MENTORS.DESELECT_STUDENT(mentorId), {
      body: { studentId },
    });
  },
};
