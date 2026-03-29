/**
 * Tests for StatsCard component — rendering, props, and optional description.
 */
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { StatsCard } from "../StatsCard";
import { Users } from "lucide-react";

describe("StatsCard", () => {
  it("renders title and value", () => {
    render(<StatsCard title="Total Students" value={42} icon={Users} />);
    expect(screen.getByText("Total Students")).toBeInTheDocument();
    expect(screen.getByText("42")).toBeInTheDocument();
  });

  it("renders optional description when provided", () => {
    render(
      <StatsCard title="Sessions" value="12" icon={Users} description="Last 30 days" />
    );
    expect(screen.getByText("Last 30 days")).toBeInTheDocument();
  });

  it("does not render description when not provided", () => {
    render(<StatsCard title="Active" value={5} icon={Users} />);
    expect(screen.queryByText("Last 30 days")).not.toBeInTheDocument();
  });
});
