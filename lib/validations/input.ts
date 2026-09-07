import { z } from "zod";

export const githubUrlSchema = z
  .string()
  .trim()
  .optional()
  .refine(
    (val) => {
      if (!val || val.length === 0) return true;
      try {
        const url = new URL(val);
        return url.hostname === "github.com";
      } catch {
        return false;
      }
    },
    { message: "Enter a valid GitHub repository URL (https://github.com/...)" },
  );

export const codeSnippetSchema = z
  .string()
  .trim()
  .optional()
  .refine(
    (val) => {
      if (!val || val.length === 0) return true;
      return val.length >= 20;
    },
    { message: "Code snippet must be at least 20 characters." },
  );

export const reviewInputSchema = z
  .object({
    githubUrl: githubUrlSchema,
    codeSnippet: codeSnippetSchema,
    resumeText: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const hasGithub = Boolean(data.githubUrl?.trim());
    const hasCode = Boolean(data.codeSnippet?.trim());
    const hasResume = Boolean(data.resumeText?.trim());
    if (!hasGithub && !hasCode && !hasResume) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["githubUrl"],
        message:
          "Add a resume PDF, a GitHub link, or a code snippet — at least one source is required.",
      });
    }
    if (!process.env.NEXT_PUBLIC_ALLOW_BOTH && hasGithub && hasCode) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["codeSnippet"],
        message:
          "Pick one: a GitHub link or a code snippet, not both.",
      });
    }
  });

export type ReviewInput = z.infer<typeof reviewInputSchema>;