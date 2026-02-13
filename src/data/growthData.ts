export interface SkillRatings {
  confidence: number;
  discipline: number;
  communication: number;
  learningSpeed: number;
}

export interface GrowthRecord {
  studentId: string;
  mentorId: string;
  ratings: SkillRatings;
  previousRatings: SkillRatings;
  notes: string;
}

export const growthData: GrowthRecord[] = [
  {
    studentId: "s1",
    mentorId: "m1",
    ratings: { confidence: 7, discipline: 8, communication: 6, learningSpeed: 9 },
    previousRatings: { confidence: 5, discipline: 6, communication: 4, learningSpeed: 7 },
    notes: "Anita shows strong curiosity and asks great questions. Her coding skills are improving rapidly.",
  },
  {
    studentId: "s2",
    mentorId: "m2",
    ratings: { confidence: 8, discipline: 7, communication: 5, learningSpeed: 6 },
    previousRatings: { confidence: 6, discipline: 5, communication: 4, learningSpeed: 5 },
    notes: "Ravi has excellent athletic potential. Needs to work on communication and expressing himself.",
  },
  {
    studentId: "s3",
    mentorId: "m3",
    ratings: { confidence: 6, discipline: 9, communication: 8, learningSpeed: 7 },
    previousRatings: { confidence: 4, discipline: 7, communication: 6, learningSpeed: 6 },
    notes: "Meena is incredibly disciplined and her business acumen is growing. Great communicator.",
  },
];
