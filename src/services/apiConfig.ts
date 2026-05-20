/**
 * API Configuration & Endpoint Declarations
 * 
 * When switching to a real backend, update BASE_URL and 
 * set USE_STATIC_DATA to false. All services will then
 * hit real endpoints instead of returning static data.
 */

export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api",
  USE_STATIC_DATA: false, // Set to true to use static demo data
  TIMEOUT: 10000,
};

/** All backend endpoint declarations */
export const ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: "/auth/login",
    SIGNUP: "/auth/signup",
    LOGOUT: "/auth/logout",
    ME: "/auth/me",
    REFRESH: "/auth/refresh",
  },

  // Mentors
  MENTORS: {
    LIST: "/mentors",
    BY_ID: (id: string) => `/mentors/${id}`,
    DASHBOARD: "/mentor/dashboard",
    STUDENTS: (id: string) => `/mentors/${id}/students`,
    SELECT_STUDENT: (id: string) => `/mentors/${id}/select-student`,
    DESELECT_STUDENT: (id: string) => `/mentors/${id}/deselect-student`,
  },

  // Students
  STUDENTS: {
    LIST: "/students",
    BY_ID: (id: string) => `/students/${id}`,
    MENTOR: (id: string) => `/students/${id}/mentor`,
  },

  // Sessions
  SESSIONS: {
    LIST: "/sessions",
    BY_ID: (id: string) => `/sessions/${id}`,
    BY_MENTOR: (mentorId: string) => `/sessions/mentor/${mentorId}`,
    BY_STUDENT: (studentId: string) => `/sessions/student/${studentId}`,
    CREATE: "/sessions",
    TOGGLE_SAVE: (id: string) => `/sessions/${id}/toggle-save`,
  },

  // Messages / Chat
  MESSAGES: {
    CONVERSATION: (userId1: string, userId2: string) =>
      `/messages/${userId1}/${userId2}`,
    SEND: "/messages",
  },

  // Growth Tracking
  GROWTH: {
    BY_STUDENT: (studentId: string) => `/growth/${studentId}`,
    UPDATE: (studentId: string) => `/growth/${studentId}`,
  },

  // Seriousness / Performance
  SERIOUSNESS: {
    BY_STUDENT: (studentId: string) => `/seriousness/${studentId}`,
    LIST: "/seriousness",
  },

  // Support / NGO Layer
  SUPPORT: {
    PROGRAMS: "/support/programs",
    REQUESTS: "/support/requests",
    BY_STUDENT: (studentId: string) => `/support/requests/student/${studentId}`,
    CREATE_REQUEST: "/support/requests",
    UPDATE_STATUS: (id: string) => `/support/requests/${id}/status`,
    MARK_NEEDS_SUPPORT: (studentId: string) => `/support/needs/${studentId}`,
  },
} as const;
