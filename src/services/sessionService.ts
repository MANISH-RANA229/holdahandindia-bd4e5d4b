import { API_CONFIG, ENDPOINTS } from "./apiConfig";
import { httpClient } from "./httpClient";
import { Session } from "@/data/types";
import { sessions as staticSessions } from "@/data/sessions";

export const sessionService = {
  async getAll(): Promise<Session[]> {
    if (API_CONFIG.USE_STATIC_DATA) return staticSessions;
    const res = await httpClient.get<Session[]>(ENDPOINTS.SESSIONS.LIST);
    return res.data;
  },

  async getByMentor(mentorId: string): Promise<Session[]> {
    if (API_CONFIG.USE_STATIC_DATA) {
      return staticSessions.filter((s) => s.mentorId === mentorId);
    }
    const res = await httpClient.get<Session[]>(ENDPOINTS.SESSIONS.BY_MENTOR(mentorId));
    return res.data;
  },

  async getByStudent(studentId: string): Promise<Session[]> {
    if (API_CONFIG.USE_STATIC_DATA) {
      return staticSessions.filter((s) => s.studentId === studentId);
    }
    const res = await httpClient.get<Session[]>(ENDPOINTS.SESSIONS.BY_STUDENT(studentId));
    return res.data;
  },

  async toggleSave(sessionId: string): Promise<void> {
    if (API_CONFIG.USE_STATIC_DATA) return;
    await httpClient.patch(ENDPOINTS.SESSIONS.TOGGLE_SAVE(sessionId));
  },

  async create(session: Omit<Session, "id">): Promise<Session> {
    if (API_CONFIG.USE_STATIC_DATA) {
      return { ...session, id: `ses${Date.now()}` };
    }
    const res = await httpClient.post<Session>(ENDPOINTS.SESSIONS.CREATE, {
      body: session,
    });
    return res.data;
  },
};
