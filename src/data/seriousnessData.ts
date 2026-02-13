export interface SeriousnessRecord {
  studentId: string;
  attendanceRate: number;
  missedSessions: number;
  consistencyScore: number;
  lastActiveDaysAgo: number;
}

export type ActivityStatus = "Active" | "Irregular" | "Inactive";

export function getActivityStatus(record: SeriousnessRecord): ActivityStatus {
  if (record.lastActiveDaysAgo <= 2 && record.consistencyScore >= 70) return "Active";
  if (record.lastActiveDaysAgo <= 7 && record.consistencyScore >= 40) return "Irregular";
  return "Inactive";
}

export function getSeriousnessLevel(record: SeriousnessRecord): "high" | "medium" | "low" {
  const score = (record.attendanceRate + record.consistencyScore) / 2;
  if (score >= 70) return "high";
  if (score >= 45) return "medium";
  return "low";
}

export const seriousnessData: SeriousnessRecord[] = [
  { studentId: "s1", attendanceRate: 92, missedSessions: 1, consistencyScore: 88, lastActiveDaysAgo: 0 },
  { studentId: "s2", attendanceRate: 78, missedSessions: 3, consistencyScore: 65, lastActiveDaysAgo: 2 },
  { studentId: "s3", attendanceRate: 95, missedSessions: 0, consistencyScore: 91, lastActiveDaysAgo: 1 },
  { studentId: "s4", attendanceRate: 60, missedSessions: 5, consistencyScore: 42, lastActiveDaysAgo: 5 },
  { studentId: "s5", attendanceRate: 45, missedSessions: 7, consistencyScore: 30, lastActiveDaysAgo: 10 },
  { studentId: "s6", attendanceRate: 85, missedSessions: 2, consistencyScore: 78, lastActiveDaysAgo: 1 },
];
