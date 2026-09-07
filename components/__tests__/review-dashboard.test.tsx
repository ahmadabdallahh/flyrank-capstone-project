import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ReviewDashboard } from "@/components/review-dashboard";
import type { ReviewData } from "@/lib/validations/review";

const review: ReviewData = {
  overallScore: 72,
  categoryScores: {
    atsCompatibility: 68,
    techStackImpact: 78,
    codeQuality: 74,
    structure: 62,
  },
  strengths: ["Strong React experience"],
  weaknesses: ["Missing summary section"],
  actionableFixes: [
    {
      title: "Add a summary",
      impact: "High",
      suggestedCodeOrText: "Experienced frontend developer...",
    },
  ],
};

describe("ReviewDashboard", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("renders tabs", () => {
    render(<ReviewDashboard review={review} />);
    expect(screen.getByRole("tab", { name: "Strengths" })).toBeTruthy();
    expect(screen.getByRole("tab", { name: "Weaknesses" })).toBeTruthy();
    expect(screen.getByRole("tab", { name: "Actionable Fixes" })).toBeTruthy();
  });

  it("shows fixes tab by default", () => {
    render(<ReviewDashboard review={review} />);
    expect(screen.getByText("Add a summary")).toBeTruthy();
    expect(screen.getByText("High")).toBeTruthy();
  });

  it("switches to strengths tab", () => {
    render(<ReviewDashboard review={review} />);
    fireEvent.click(screen.getByRole("tab", { name: "Strengths" }));
    expect(screen.getByText("Strong React experience")).toBeTruthy();
  });

  it("copies the suggested fix to clipboard", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });

    render(<ReviewDashboard review={review} />);
    fireEvent.click(screen.getByRole("button", { name: "Copy" }));
    expect(writeText).toHaveBeenCalledWith("Experienced frontend developer...");
  });
});