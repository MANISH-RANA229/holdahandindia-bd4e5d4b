import { API_CONFIG, ENDPOINTS } from "./apiConfig";
import { httpClient } from "./httpClient";
import { GrowthRecord, SkillRatings, growthData } from "@/data/growthData";

export const growthService = {
  async getByStudent(studentId: string): Promise<GrowthRecord | null> {
    if (API_CONFIG.USE_STATIC_DATA) {
      return growthData.find((g) => g.studentId === studentId) ?? null;
    }
    const res = await httpClient.get<GrowthRecord>(
      ENDPOINTS.GROWTH.BY_STUDENT(studentId)
    );
    return res.data;
  },

  async updateRatings(
    studentId: string,
    ratings: SkillRatings,
    notes: string
  ): Promise<GrowthRecord> {
    if (API_CONFIG.USE_STATIC_DATA) {
      const existing = growthData.find((g) => g.studentId === studentId);
      return {
        studentId,
        mentorId: existing?.mentorId ?? "",
        ratings,
        previousRatings: existing?.ratings ?? ratings,
        notes,
      };
    }
    const res = await httpClient.put<GrowthRecord>(
      ENDPOINTS.GROWTH.UPDATE(studentId),
      { body: { ratings, notes } }
    );
    return res.data;
  },
};
