import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ScoreGauge } from "@/components/score-gauge";

const categoryScores = {
  atsCompatibility: 68,
  techStackImpact: 78,
  codeQuality: 74,
  structure: 62,
};

describe("ScoreGauge", () => {
  it("renders the overall score", () => {
    render(<ScoreGauge score={72} categoryScores={categoryScores} />);
    expect(screen.getByText("72")).toBeTruthy();
  });

  it("renders all four category progressbars with values", () => {
    render(<ScoreGauge score={72} categoryScores={categoryScores} />);
    const bars = screen.getAllByRole("progressbar");
    expect(bars).toHaveLength(4);
    expect(bars[0]).toHaveAttribute("aria-valuenow", "68");
    expect(bars[1]).toHaveAttribute("aria-valuenow", "78");
    expect(bars[2]).toHaveAttribute("aria-valuenow", "74");
    expect(bars[3]).toHaveAttribute("aria-valuenow", "62");
  });

  it("has an accessible label", () => {
    render(<ScoreGauge score={72} categoryScores={categoryScores} />);
    expect(
      screen.getByRole("region", { name: /overall score and category/i }),
    ).toBeTruthy();
  });
});