import React, { createContext, useContext, useState } from "react";
import { Student } from "@/data/types";
import { students as initialStudents } from "@/data/students";
import { sessions as initialSessions } from "@/data/sessions";
import { messages as initialMessages } from "@/data/messages";
import { Session, Message } from "@/data/types";

interface AppDataContextType {
  students: Student[];
  sessions: Session[];
  messages: Message[];
  selectedStudentIds: Record<string, string[]>; // mentorId -> studentIds
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

  return (
    <AppDataContext.Provider value={{
      students, sessions, messages: msgs, selectedStudentIds,
      selectStudent, unselectStudent, isStudentSelected, getSelectedStudents,
      addMessage, addSession, toggleSessionSaved,
      dailyMessageCount, weeklyCallCount,
      incrementMessageCount, incrementCallCount, resetDailyMessages,
    }}>
      {children}
    </AppDataContext.Provider>
  );
};
