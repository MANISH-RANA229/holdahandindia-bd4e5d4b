import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { User, Mentor, Student } from "@/data/types";
import { authService, setUnauthorizedHandler, clearUnauthorizedHandler } from "@/services";

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<User | null>;
  signup: (userData: Partial<Mentor> | Partial<Student>) => Promise<User | null>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Restore session on mount via /auth/me (if token exists in localStorage)
  useEffect(() => {
    const restoreSession = async () => {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const currentUser = await authService.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
        } else {
          localStorage.removeItem("auth_token");
        }
      } catch {
        localStorage.removeItem("auth_token");
      } finally {
        setLoading(false);
      }
    };
    restoreSession();
  }, []);

  const login = useCallback(async (username: string, password: string): Promise<User | null> => {
    try {
      const result = await authService.login({ username, password });
      if (result && result.user) {
        if (result.token) {
          localStorage.setItem("auth_token", result.token);
        }
        setUser(result.user);
        return result.user;
      }
      return null;
    } catch {
      return null;
    }
  }, []);

  const signup = useCallback(async (userData: Partial<Mentor> | Partial<Student>): Promise<User | null> => {
    try {
      const result = await authService.signup({ userData });
      if (result && result.user) {
        if (result.token) {
          localStorage.setItem("auth_token", result.token);
        }
        setUser(result.user);
        return result.user;
      }
      return null;
    } catch {
      return null;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      // Ignore logout API errors
    } finally {
      localStorage.removeItem("auth_token");
      setUser(null);
    }
  }, []);

  // Wire 401 middleware to auto-logout
  useEffect(() => {
    setUnauthorizedHandler(logout);
    return () => clearUnauthorizedHandler();
  }, [logout]);

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isAuthenticated: !!user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
