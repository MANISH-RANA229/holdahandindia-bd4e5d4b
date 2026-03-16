import { API_CONFIG, ENDPOINTS } from "./apiConfig";
import { httpClient } from "./httpClient";
import { User, Mentor, Student } from "@/data/types";
import { mentors } from "@/data/mentors";
import { students } from "@/data/students";

const allStaticUsers: User[] = [...mentors, ...students];

export interface LoginRequest {
  username: string;
  password: string;
}

export interface SignupRequest {
  userData: Partial<Mentor> | Partial<Student>;
}

export interface AuthResponse {
  user: User;
  token?: string;
}

export const authService = {
  async login(payload: LoginRequest): Promise<AuthResponse | null> {
    if (API_CONFIG.USE_STATIC_DATA) {
      const found = allStaticUsers.find(
        (u) => u.username === payload.username && u.password === payload.password
      );
      return found ? { user: found } : null;
    }
    const res = await httpClient.post<AuthResponse>(ENDPOINTS.AUTH.LOGIN, {
      body: payload,
    });
    return res.data;
  },

  async signup(payload: SignupRequest): Promise<AuthResponse | null> {
    if (API_CONFIG.USE_STATIC_DATA) {
      const exists = allStaticUsers.find(
        (u) => u.username === payload.userData.username
      );
      if (exists) return null;
      const newUser = { ...payload.userData, id: `u${Date.now()}` } as User;
      return { user: newUser };
    }
    const res = await httpClient.post<AuthResponse>(ENDPOINTS.AUTH.SIGNUP, {
      body: payload.userData,
    });
    return res.data;
  },

  async logout(): Promise<void> {
    if (API_CONFIG.USE_STATIC_DATA) return;
    await httpClient.post(ENDPOINTS.AUTH.LOGOUT);
  },

  async getCurrentUser(): Promise<User | null> {
    if (API_CONFIG.USE_STATIC_DATA) return null;
    const res = await httpClient.get<AuthResponse>(ENDPOINTS.AUTH.ME);
    return res.data.user;
  },
};
