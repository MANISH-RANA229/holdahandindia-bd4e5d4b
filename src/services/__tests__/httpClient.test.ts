/**
 * Tests for httpClient — 401 middleware and request logic.
 * Uses vi.fn() to mock fetch and the unauthorized handler.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { setUnauthorizedHandler, clearUnauthorizedHandler, ApiError } from "../httpClient";

// We need to test the raw request behaviour, so import the client
const { httpClient } = await import("../httpClient");

describe("httpClient", () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    clearUnauthorizedHandler();
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it("calls the unauthorized handler on 401 responses", async () => {
    const logoutSpy = vi.fn();
    setUnauthorizedHandler(logoutSpy);

    globalThis.fetch = vi.fn().mockResolvedValue({
      status: 401,
      ok: false,
      json: () => Promise.resolve({}),
    });

    await expect(httpClient.get("/test")).rejects.toThrow(ApiError);
    expect(logoutSpy).toHaveBeenCalledOnce();
  });

  it("throws ApiError for non-OK responses", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      status: 500,
      ok: false,
      json: () => Promise.resolve({ message: "Internal Server Error" }),
    });

    await expect(httpClient.get("/test")).rejects.toThrow("Internal Server Error");
  });

  it("returns parsed JSON for successful requests", async () => {
    const mockData = { id: 1, name: "Test" };
    globalThis.fetch = vi.fn().mockResolvedValue({
      status: 200,
      ok: true,
      json: () => Promise.resolve(mockData),
    });

    const result = await httpClient.get<typeof mockData>("/test");
    expect(result.data).toEqual(mockData);
    expect(result.ok).toBe(true);
  });

  it("throws ApiError on network failure", async () => {
    globalThis.fetch = vi.fn().mockRejectedValue(new Error("Network error"));

    await expect(httpClient.get("/test")).rejects.toThrow("Network error");
  });
});
