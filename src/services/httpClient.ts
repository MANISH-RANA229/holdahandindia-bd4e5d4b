/**
 * HTTP Client with 401 middleware (auto-logout).
 * 
 * When USE_STATIC_DATA is false, all service methods 
 * will route through this client.
 */

import { API_CONFIG } from "./apiConfig";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface RequestOptions {
  body?: unknown;
  headers?: Record<string, string>;
  params?: Record<string, string>;
}

interface ApiResponse<T> {
  data: T;
  status: number;
  ok: boolean;
}

// Callback set by AuthContext to handle forced logout
let onUnauthorized: (() => void) | null = null;

export function setUnauthorizedHandler(handler: () => void) {
  onUnauthorized = handler;
}

export function clearUnauthorizedHandler() {
  onUnauthorized = null;
}

async function request<T>(
  method: HttpMethod,
  endpoint: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> {
  const url = new URL(`${API_CONFIG.BASE_URL}${endpoint}`);

  if (options.params) {
    Object.entries(options.params).forEach(([key, value]) =>
      url.searchParams.append(key, value)
    );
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);

  try {
    const response = await fetch(url.toString(), {
      method,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
      signal: controller.signal,
      credentials: "include", // send cookies for session-based auth
    });

    clearTimeout(timeout);

    // 401 Middleware — auto logout
    if (response.status === 401) {
      console.warn("[httpClient] 401 Unauthorized — triggering logout");
      onUnauthorized?.();
      throw new ApiError("Unauthorized", 401);
    }

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      throw new ApiError(
        errorBody.message || `Request failed with status ${response.status}`,
        response.status
      );
    }

    const data = (await response.json()) as T;
    return { data, status: response.status, ok: true };
  } catch (error) {
    clearTimeout(timeout);
    if (error instanceof ApiError) throw error;
    throw new ApiError(
      error instanceof Error ? error.message : "Network error",
      0
    );
  }
}

export class ApiError extends Error {
  constructor(message: string, public status: number) {
    super(message);
    this.name = "ApiError";
  }
}

// Convenience methods
export const httpClient = {
  get: <T>(endpoint: string, options?: RequestOptions) =>
    request<T>("GET", endpoint, options),
  post: <T>(endpoint: string, options?: RequestOptions) =>
    request<T>("POST", endpoint, options),
  put: <T>(endpoint: string, options?: RequestOptions) =>
    request<T>("PUT", endpoint, options),
  patch: <T>(endpoint: string, options?: RequestOptions) =>
    request<T>("PATCH", endpoint, options),
  delete: <T>(endpoint: string, options?: RequestOptions) =>
    request<T>("DELETE", endpoint, options),
};
