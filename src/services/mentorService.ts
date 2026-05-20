import { API_CONFIG, ENDPOINTS } from "./apiConfig";
import { httpClient } from "./httpClient";
import { Mentor, Student, Session } from "@/data/types";
import { GrowthRecord } from "@/data/growthData";
import { SeriousnessRecord } from "@/data/seriousnessData";
import { SupportRequest } from "@/data/supportPrograms";
import { mentors as staticMentors } from "@/data/mentors";

// Shape returned by GET /api/mentor/dashboard
export interface MentorDashboardData {
  selectedStudents: Student[];
  sessions: Session[];
  growthRecords: GrowthRecord[];
  seriousnessRecords: SeriousnessRecord[];
  supportRequests: SupportRequest[];
}

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

  /**
   * Fetch all data for the mentor dashboard in a single API call.
   * Protected: requires mentor role JWT.
   */
  async getDashboard(): Promise<MentorDashboardData> {
    if (API_CONFIG.USE_STATIC_DATA) {
      // Return empty defaults when using static data
      // (the dashboard falls back to AppDataContext in that mode)
      return {
        selectedStudents: [],
        sessions: [],
        growthRecords: [],
        seriousnessRecords: [],
        supportRequests: [],
      };
    }
    const res = await httpClient.get<MentorDashboardData>(
      ENDPOINTS.MENTORS.DASHBOARD
    );
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
