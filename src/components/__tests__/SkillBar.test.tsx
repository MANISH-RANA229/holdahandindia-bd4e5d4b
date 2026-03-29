/**
 * Tests for SkillBar component — rendering label, value, and diff indicator.
 */
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SkillBar } from "../SkillBar";

describe("SkillBar", () => {
  it("renders label and score", () => {
    render(<SkillBar label="Math" value={7} />);
    expect(screen.getByText("Math")).toBeInTheDocument();
    expect(screen.getByText("7/10")).toBeInTheDocument();
  });

  it("shows positive diff when value improved", () => {
    render(<SkillBar label="Science" value={8} previousValue={5} />);
    expect(screen.getByText("+3")).toBeInTheDocument();
  });

  it("shows negative diff when value declined", () => {
    render(<SkillBar label="Art" value={3} previousValue={6} />);
    expect(screen.getByText("-3")).toBeInTheDocument();
  });

  it("does not show diff when previousValue is not provided", () => {
    render(<SkillBar label="Music" value={5} />);
    expect(screen.queryByText("+0")).not.toBeInTheDocument();
  });

  it("respects custom max value", () => {
    render(<SkillBar label="Custom" value={50} max={100} />);
    expect(screen.getByText("50/100")).toBeInTheDocument();
  });
});
