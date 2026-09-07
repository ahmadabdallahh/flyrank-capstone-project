import { z } from "zod";

export const reviewSchema = z.object({
  overallScore: z.number().min(0).max(100),
  categoryScores: z.object({
    atsCompatibility: z.number().min(0).max(100),
    techStackImpact: z.number().min(0).max(100),
    codeQuality: z.number().min(0).max(100),
    structure: z.number().min(0).max(100),
  }),
  strengths: z.array(z.string().min(1).max(500)),
  weaknesses: z.array(z.string().min(1).max(500)),
  actionableFixes: z.array(
    z.object({
      title: z.string().min(1).max(200),
      impact: z.enum(["High", "Medium", "Low"]),
      suggestedCodeOrText: z.string().min(1).max(2000),
    }),
  ),
});

export type ReviewData = z.infer<typeof reviewSchema>;
export type ActionableFix = ReviewData["actionableFixes"][number];
export type CategoryKey = keyof ReviewData["categoryScores"];

export const CATEGORY_LABELS: Record<CategoryKey, string> = {
  atsCompatibility: "ATS Compatibility",
  techStackImpact: "Tech Stack Impact",
  codeQuality: "Code Quality",
  structure: "Structure",
};

export const CATEGORY_ORDER: CategoryKey[] = [
  "atsCompatibility",
  "techStackImpact",
  "codeQuality",
  "structure",
];