import React, { createContext, useContext, useState } from "react";
import { Student } from "@/data/types";
import { students as initialStudents } from "@/data/students";
import { sessions as initialSessions } from "@/data/sessions";
import { messages as initialMessages } from "@/data/messages";
import { Session, Message } from "@/data/types";
import { GrowthRecord, growthData as initialGrowthData } from "@/data/growthData";
import { SeriousnessRecord, seriousnessData as initialSeriousnessData } from "@/data/seriousnessData";
import { SupportRequest, initialSupportRequests, SupportRequestStatus } from "@/data/supportPrograms";

interface AppDataContextType {
  students: Student[];
  sessions: Session[];
  messages: Message[];
  selectedStudentIds: Record<string, string[]>;
  selectStudent: (mentorId: string, studentId: string) => void;
  unselectStudent: (mentorId: string, studentId: string) => void;
  isStudentSelected: (mentorId: string, studentId: string) => boolean;
  getSelectedStudents: (mentorId: string) => Student[];
  addMessage: (msg: Message) => void;
  addSession: (session: Session) => void;
  toggleSessionSaved: (sessionId: string) => void;
  dailyMessageCount: number;
  weeklyCallCount: number;
  incrementMessageCount: () => void;
  incrementCallCount: () => void;
  resetDailyMessages: () => void;
  // Growth
  growthRecords: GrowthRecord[];
  updateGrowthRating: (studentId: string, mentorId: string, skill: string, value: number) => void;
  updateGrowthNote: (studentId: string, mentorId: string, note: string) => void;
  getGrowthRecord: (studentId: string) => GrowthRecord | undefined;
  // Seriousness
  seriousnessRecords: SeriousnessRecord[];
  getSeriousnessRecord: (studentId: string) => SeriousnessRecord | undefined;
  // Support
  supportRequests: SupportRequest[];
  addSupportRequest: (studentId: string, programId: string) => void;
  updateSupportRequestStatus: (requestId: string, status: SupportRequestStatus) => void;
  addMentorSupportNote: (requestId: string, note: string) => void;
  getStudentSupportRequests: (studentId: string) => SupportRequest[];
  markStudentNeedsSupport: (studentId: string, programId: string, note: string) => void;
}

const AppDataContext = createContext<AppDataContextType | null>(null);

export const useAppData = () => {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error("useAppData must be used within AppDataProvider");
  return ctx;
};

export const AppDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [students] = useState<Student[]>(initialStudents);
  const [sessions, setSessions] = useState<Session[]>(initialSessions);
  const [msgs, setMsgs] = useState<Message[]>(initialMessages);
  const [selectedStudentIds, setSelectedStudentIds] = useState<Record<string, string[]>>({
    m1: ["s1"],
    m2: ["s2"],
    m3: ["s3"],
  });
  const [dailyMessageCount, setDailyMessageCount] = useState(0);
  const [weeklyCallCount, setWeeklyCallCount] = useState(0);

  // Growth state
  const [growthRecords, setGrowthRecords] = useState<GrowthRecord[]>(initialGrowthData);

  // Seriousness state
  const [seriousnessRecords] = useState<SeriousnessRecord[]>(initialSeriousnessData);

  // Support state
  const [supportRequests, setSupportRequests] = useState<SupportRequest[]>(initialSupportRequests);

  const selectStudent = (mentorId: string, studentId: string) => {
    setSelectedStudentIds(prev => ({
      ...prev,
      [mentorId]: [...(prev[mentorId] || []), studentId],
    }));
  };

  const unselectStudent = (mentorId: string, studentId: string) => {
    setSelectedStudentIds(prev => ({
      ...prev,
      [mentorId]: (prev[mentorId] || []).filter(id => id !== studentId),
    }));
  };

  const isStudentSelected = (mentorId: string, studentId: string) =>
    (selectedStudentIds[mentorId] || []).includes(studentId);

  const getSelectedStudents = (mentorId: string) =>
    students.filter(s => (selectedStudentIds[mentorId] || []).includes(s.id));

  const addMessage = (msg: Message) => setMsgs(prev => [...prev, msg]);
  const addSession = (session: Session) => setSessions(prev => [...prev, session]);
  const toggleSessionSaved = (sessionId: string) =>
    setSessions(prev => prev.map(s => s.id === sessionId ? { ...s, saved: !s.saved } : s));

  const incrementMessageCount = () => setDailyMessageCount(prev => prev + 1);
  const incrementCallCount = () => setWeeklyCallCount(prev => prev + 1);
  const resetDailyMessages = () => setDailyMessageCount(0);

  // Growth methods
  const updateGrowthRating = (studentId: string, mentorId: string, skill: string, value: number) => {
    setGrowthRecords(prev => {
      const existing = prev.find(r => r.studentId === studentId && r.mentorId === mentorId);
      if (existing) {
        return prev.map(r =>
          r.studentId === studentId && r.mentorId === mentorId
            ? { ...r, ratings: { ...r.ratings, [skill]: value } }
            : r
        );
      }
      return [...prev, {
        studentId, mentorId,
        ratings: { confidence: 5, discipline: 5, communication: 5, learningSpeed: 5, [skill]: value },
        previousRatings: { confidence: 5, discipline: 5, communication: 5, learningSpeed: 5 },
        notes: "",
      }];
    });
  };

  const updateGrowthNote = (studentId: string, mentorId: string, note: string) => {
    setGrowthRecords(prev => {
      const existing = prev.find(r => r.studentId === studentId && r.mentorId === mentorId);
      if (existing) {
        return prev.map(r =>
          r.studentId === studentId && r.mentorId === mentorId ? { ...r, notes: note } : r
        );
      }
      return [...prev, {
        studentId, mentorId,
        ratings: { confidence: 5, discipline: 5, communication: 5, learningSpeed: 5 },
        previousRatings: { confidence: 5, discipline: 5, communication: 5, learningSpeed: 5 },
        notes: note,
      }];
    });
  };

  const getGrowthRecord = (studentId: string) => growthRecords.find(r => r.studentId === studentId);

  const getSeriousnessRecord = (studentId: string) => seriousnessRecords.find(r => r.studentId === studentId);

  // Support methods
  const addSupportRequest = (studentId: string, programId: string) => {
    const id = `sr${Date.now()}`;
    setSupportRequests(prev => [...prev, { id, studentId, programId, status: "Requested" }]);
  };

  const updateSupportRequestStatus = (requestId: string, status: SupportRequestStatus) => {
    setSupportRequests(prev => prev.map(r => r.id === requestId ? { ...r, status } : r));
  };

  const addMentorSupportNote = (requestId: string, note: string) => {
    setSupportRequests(prev => prev.map(r => r.id === requestId ? { ...r, mentorNote: note } : r));
  };

  const getStudentSupportRequests = (studentId: string) =>
    supportRequests.filter(r => r.studentId === studentId);

  const markStudentNeedsSupport = (studentId: string, programId: string, note: string) => {
    const id = `sr${Date.now()}`;
    setSupportRequests(prev => [...prev, { id, studentId, programId, status: "Under Review", mentorNote: note }]);
  };

  return (
    <AppDataContext.Provider value={{
      students, sessions, messages: msgs, selectedStudentIds,
      selectStudent, unselectStudent, isStudentSelected, getSelectedStudents,
      addMessage, addSession, toggleSessionSaved,
      dailyMessageCount, weeklyCallCount,
      incrementMessageCount, incrementCallCount, resetDailyMessages,
      growthRecords, updateGrowthRating, updateGrowthNote, getGrowthRecord,
      seriousnessRecords, getSeriousnessRecord,
      supportRequests, addSupportRequest, updateSupportRequestStatus,
      addMentorSupportNote, getStudentSupportRequests, markStudentNeedsSupport,
    }}>
      {children}
    </AppDataContext.Provider>
  );
};
