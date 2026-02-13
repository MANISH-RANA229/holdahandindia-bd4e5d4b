export interface SupportProgram {
  id: string;
  type: string;
  description: string;
  amount: number;
}

export type SupportRequestStatus = "Requested" | "Under Review" | "Sponsored";

export interface SupportRequest {
  id: string;
  studentId: string;
  programId: string;
  status: SupportRequestStatus;
  mentorNote?: string;
}

export const supportPrograms: SupportProgram[] = [
  { id: "sp1", type: "Sponsor Student", description: "Sponsor one student's mentorship journey", amount: 500 },
  { id: "sp2", type: "Donate Books", description: "Provide study material support", amount: 300 },
  { id: "sp3", type: "Sponsor Training", description: "Help a sports student get coaching", amount: 1000 },
  { id: "sp4", type: "Sponsor Exam Fees", description: "Support exam registration cost", amount: 700 },
];

export const initialSupportRequests: SupportRequest[] = [
  { id: "sr1", studentId: "s1", programId: "sp2", status: "Under Review", mentorNote: "Needs advanced math books" },
  { id: "sr2", studentId: "s2", programId: "sp3", status: "Requested" },
  { id: "sr3", studentId: "s3", programId: "sp1", status: "Sponsored", mentorNote: "Sponsored for full year" },
];
