import type { ReviewData } from "./validations/review";

export const mockReviewData: ReviewData = {
  overallScore: 72,
  categoryScores: {
    atsCompatibility: 68,
    techStackImpact: 78,
    codeQuality: 74,
    structure: 62,
  },
  strengths: [
    "Strong experience with React and TypeScript with concrete years of experience.",
    "Includes measurable outcomes (percentages, performance gains) in work history.",
    "Uses action verbs like 'built', 'shipped', and 'improved' throughout.",
    "Relevant tech stack keywords (Next.js, Tailwind, testing) appear in context.",
  ],
  weaknesses: [
    "Missing a clear 'Summary' section at the top for ATS keyword scanning.",
    "No explicit mention of accessibility work (WCAG/ARIA) despite the stack.",
    "Job dates are unclear; recruiters prefer month-year ranges.",
    "No links to live projects or GitHub repositories.",
  ],
  actionableFixes: [
    {
      title: "Add a two-line professional summary with target keywords",
      impact: "High",
      suggestedCodeOrText:
        "Frontend developer with 4+ years building accessible, production web apps in React + TypeScript. Skilled in Next.js, Tailwind CSS, and test-driven development.",
    },
    {
      title: "List specific accessibility wins",
      impact: "Medium",
      suggestedCodeOrText:
        "Rebuilt checkout forms with WCAG 2.1 AA compliance (axe verified) — reduced keyboard navigation issues by 40%.",
    },
    {
      title: "Format employment dates as month-year ranges",
      impact: "Low",
      suggestedCodeOrText: "Mar 2022 – Present instead of '2022-now'",
    },
    {
      title: "Add links to GitHub and 2 live projects",
      impact: "High",
      suggestedCodeOrText:
        "[portfolio.you.dev] (built with Next.js + Tailwind, Lighthouse 98 performance)",
    },
  ],
};