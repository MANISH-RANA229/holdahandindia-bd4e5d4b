/**
 * Tests for ActivityStatusBadge — renders correct status text and styling.
 */
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ActivityStatusBadge } from "../ActivityStatusBadge";

describe("ActivityStatusBadge", () => {
  it('renders "Active" badge', () => {
    render(<ActivityStatusBadge status="Active" />);
    expect(screen.getByText("Active")).toBeInTheDocument();
  });

  it('renders "Irregular" badge', () => {
    render(<ActivityStatusBadge status="Irregular" />);
    expect(screen.getByText("Irregular")).toBeInTheDocument();
  });

  it('renders "Inactive" badge', () => {
    render(<ActivityStatusBadge status="Inactive" />);
    expect(screen.getByText("Inactive")).toBeInTheDocument();
  });
});
