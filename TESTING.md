# Testing Guide — Hold A Hand India

## Overview

This project uses **Vitest** and **React Testing Library** for testing.

### What is Vitest?

Vitest is a blazing-fast unit test framework powered by Vite. It provides Jest-compatible APIs (`describe`, `it`, `expect`, `vi.fn()`, `vi.mock()`) with native ES module support and instant HMR-driven re-runs.

### What is React Testing Library?

React Testing Library (RTL) encourages testing components the way users interact with them — by querying text, roles, and labels instead of internal implementation details. This makes tests resilient to refactors.

### Why we use them

| Concern | Tool |
|---------|------|
| Test runner, assertions, mocking | Vitest |
| DOM rendering & user-centric queries | React Testing Library |
| DOM environment in Node | jsdom |
| Extended DOM matchers (`toBeInTheDocument`) | @testing-library/jest-dom |

---

## Folder Structure

```
src/
├── components/
│   ├── __tests__/              # Component tests
│   │   ├── StatsCard.test.tsx
│   │   ├── SkillBar.test.tsx
│   │   ├── ChatWindow.test.tsx
│   │   └── ActivityStatusBadge.test.tsx
├── data/
│   └── __tests__/
│       └── seriousnessData.test.ts   # Pure function tests
├── lib/
│   └── __tests__/
│       └── utils.test.ts             # Utility function tests
├── services/
│   └── __tests__/
│       ├── apiConfig.test.ts         # Endpoint structure tests
│       ├── httpClient.test.ts        # HTTP client + 401 middleware tests
│       └── studentService.test.ts    # Service layer tests (mocked)
└── test/
    ├── setup.ts                      # Global test setup
    └── example.test.ts               # Sanity check
```

**Convention:** Tests live in `__tests__/` folders next to the code they test, named `*.test.ts` or `*.test.tsx`.

---

## How to Run Tests

### Run all tests once
```bash
npm test
```

### Run tests in watch mode (re-runs on file changes)
```bash
npm run test:watch
```

### Run tests with coverage report
```bash
npm run test:coverage
```

Coverage reports are generated in the `./coverage` directory as HTML, text, and LCOV formats.

---

## Coverage Thresholds

The project enforces **70%** minimum coverage for:
- Statements
- Branches
- Functions
- Lines

These thresholds are configured in `vitest.config.ts`.

---

## How to Write a Test

### Example: Testing a component

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { StatsCard } from "../StatsCard";
import { Users } from "lucide-react";

describe("StatsCard", () => {
  it("renders title and value", () => {
    render(<StatsCard title="Students" value={42} icon={Users} />);
    expect(screen.getByText("Students")).toBeInTheDocument();
    expect(screen.getByText("42")).toBeInTheDocument();
  });
});
```

### Example: Testing a utility function

```ts
import { describe, it, expect } from "vitest";
import { cn } from "../utils";

describe("cn", () => {
  it("merges classes and resolves Tailwind conflicts", () => {
    expect(cn("px-4", "px-8")).toBe("px-8");
  });
});
```

### Example: Mocking an API call

```ts
import { vi } from "vitest";

// Mock fetch globally
globalThis.fetch = vi.fn().mockResolvedValue({
  status: 200,
  ok: true,
  json: () => Promise.resolve({ data: "test" }),
});
```

---

## Best Practices

1. **Test behavior, not implementation** — Query by text, role, or label, not by CSS class or component internals.
2. **Use `screen` queries** — Prefer `screen.getByRole()`, `screen.getByText()`, `screen.getByPlaceholderText()`.
3. **Avoid snapshots** — They break easily and provide little value. Test specific assertions instead.
4. **Mock at the boundary** — Mock `fetch` or service functions, not internal component state.
5. **Keep tests focused** — Each `it()` block should test one behavior.
6. **Use factory functions** — Create helpers like `makeRecord()` to build test data with sensible defaults.

---

## Common Mistakes

| Mistake | Better Approach |
|---------|----------------|
| Testing internal state | Test what the user sees |
| Snapshot-heavy tests | Assert specific text/elements |
| Not cleaning up mocks | Use `beforeEach`/`afterEach` with `vi.restoreAllMocks()` |
| Testing library internals | Only test your own code |
| Ignoring async behavior | Use `findByText` or `waitFor` for async updates |

---

## Configuration Files

| File | Purpose |
|------|---------|
| `vitest.config.ts` | Test runner config (environment, coverage, aliases) |
| `src/test/setup.ts` | Global setup (jest-dom matchers, matchMedia mock) |
| `tsconfig.app.json` | TypeScript config with `vitest/globals` types |
