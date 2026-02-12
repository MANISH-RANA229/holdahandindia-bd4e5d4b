export type UserRole = "mentor" | "student";

export interface User {
  id: string;
  username: string;
  password: string;
  role: UserRole;
  name: string;
}

export interface Mentor extends User {
  role: "mentor";
  field: "sports" | "study" | "business";
  experience: string;
  bio: string;
  avatar: string;
  studentsGuided: number;
  sessionsCompleted: number;
}

export interface Student extends User {
  role: "student";
  age: number;
  interests: string[];
  goals: string;
  background: string;
  avatar: string;
  assignedMentorId: string | null;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
}

export interface Session {
  id: string;
  mentorId: string;
  studentId: string;
  date: string;
  duration: string;
  topic: string;
  status: "completed" | "scheduled" | "cancelled";
  saved: boolean;
}
