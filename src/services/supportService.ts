import { API_CONFIG, ENDPOINTS } from "./apiConfig";
import { httpClient } from "./httpClient";
import {
  SupportProgram,
  SupportRequest,
  SupportRequestStatus,
  supportPrograms,
  initialSupportRequests,
} from "@/data/supportPrograms";

export const supportService = {
  async getPrograms(): Promise<SupportProgram[]> {
    if (API_CONFIG.USE_STATIC_DATA) return supportPrograms;
    const res = await httpClient.get<SupportProgram[]>(ENDPOINTS.SUPPORT.PROGRAMS);
    return res.data;
  },

  async getRequests(): Promise<SupportRequest[]> {
    if (API_CONFIG.USE_STATIC_DATA) return initialSupportRequests;
    const res = await httpClient.get<SupportRequest[]>(ENDPOINTS.SUPPORT.REQUESTS);
    return res.data;
  },

  async getByStudent(studentId: string): Promise<SupportRequest[]> {
    if (API_CONFIG.USE_STATIC_DATA) {
      return initialSupportRequests.filter((r) => r.studentId === studentId);
    }
    const res = await httpClient.get<SupportRequest[]>(
      ENDPOINTS.SUPPORT.BY_STUDENT(studentId)
    );
    return res.data;
  },

  async createRequest(
    studentId: string,
    programId: string
  ): Promise<SupportRequest> {
    if (API_CONFIG.USE_STATIC_DATA) {
      return {
        id: `sr${Date.now()}`,
        studentId,
        programId,
        status: "Requested",
      };
    }
    const res = await httpClient.post<SupportRequest>(
      ENDPOINTS.SUPPORT.CREATE_REQUEST,
      { body: { studentId, programId } }
    );
    return res.data;
  },

  async updateStatus(
    requestId: string,
    status: SupportRequestStatus
  ): Promise<void> {
    if (API_CONFIG.USE_STATIC_DATA) return;
    await httpClient.patch(ENDPOINTS.SUPPORT.UPDATE_STATUS(requestId), {
      body: { status },
    });
  },
};
