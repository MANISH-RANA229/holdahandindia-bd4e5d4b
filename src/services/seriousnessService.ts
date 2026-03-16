import { API_CONFIG, ENDPOINTS } from "./apiConfig";
import { httpClient } from "./httpClient";
import { SeriousnessRecord, seriousnessData } from "@/data/seriousnessData";

export const seriousnessService = {
  async getByStudent(studentId: string): Promise<SeriousnessRecord | null> {
    if (API_CONFIG.USE_STATIC_DATA) {
      return seriousnessData.find((s) => s.studentId === studentId) ?? null;
    }
    const res = await httpClient.get<SeriousnessRecord>(
      ENDPOINTS.SERIOUSNESS.BY_STUDENT(studentId)
    );
    return res.data;
  },

  async getAll(): Promise<SeriousnessRecord[]> {
    if (API_CONFIG.USE_STATIC_DATA) return seriousnessData;
    const res = await httpClient.get<SeriousnessRecord[]>(ENDPOINTS.SERIOUSNESS.LIST);
    return res.data;
  },
};
