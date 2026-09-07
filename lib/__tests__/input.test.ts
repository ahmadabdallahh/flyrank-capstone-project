import { describe, it, expect } from "vitest";
import { reviewInputSchema } from "@/lib/validations/input";

describe("reviewInputSchema", () => {
  it("accepts a valid GitHub URL", () => {
    const result = reviewInputSchema.safeParse({
      githubUrl: "https://github.com/user/repo",
      codeSnippet: "",
    });
    expect(result.success).toBe(true);
  });

  it("rejects a non-GitHub URL", () => {
    const result = reviewInputSchema.safeParse({
      githubUrl: "https://gitlab.com/user/repo",
      codeSnippet: "",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.message.includes("GitHub"))).toBe(
        true,
      );
    }
  });

  it("rejects a short code snippet", () => {
    const result = reviewInputSchema.safeParse({
      githubUrl: "",
      codeSnippet: "short",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.message.includes("20 characters"))).toBe(
        true,
      );
    }
  });

  it("rejects when no source is provided", () => {
    const result = reviewInputSchema.safeParse({
      githubUrl: "",
      codeSnippet: "",
      resumeText: "",
    });
    expect(result.success).toBe(false);
  });

  it("accepts resume text as a valid source", () => {
    const result = reviewInputSchema.safeParse({
      githubUrl: "",
      codeSnippet: "",
      resumeText: "Experienced frontend developer",
    });
    expect(result.success).toBe(true);
  });
});