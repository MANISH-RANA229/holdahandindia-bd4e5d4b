import React, { createContext, useContext, useState, useCallback } from "react";
import { User, Mentor, Student, UserRole } from "@/data/types";
import { mentors } from "@/data/mentors";
import { students as studentsData } from "@/data/students";

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => boolean;
  signup: (userData: Partial<Mentor> | Partial<Student>) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [customUsers, setCustomUsers] = useState<User[]>([]);

  const allUsers: User[] = [...mentors, ...studentsData, ...customUsers];

  const login = useCallback((username: string, password: string): boolean => {
    const found = allUsers.find(u => u.username === username && u.password === password);
    if (found) {
      setUser(found);
      return true;
    }
    return false;
  }, [allUsers]);

  const signup = useCallback((userData: Partial<Mentor> | Partial<Student>): boolean => {
    const exists = allUsers.find(u => u.username === userData.username);
    if (exists) return false;
    const newUser = { ...userData, id: `u${Date.now()}` } as User;
    setCustomUsers(prev => [...prev, newUser]);
    setUser(newUser);
    return true;
  }, [allUsers]);

  const logout = useCallback(() => setUser(null), []);

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};
