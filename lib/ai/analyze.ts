"use server";

import { z } from "zod";
import { reviewSchema } from "@/lib/validations/review";
import { mockReviewData } from "@/lib/mock-review";

const PROMPT = `You are an expert ATS resume and frontend code reviewer for junior and mid-level web developers.
Analyze the provided resume text and/or code and return ONLY a valid JSON object matching this exact shape:

{
  "overallScore": number 0-100,
  "categoryScores": {
    "atsCompatibility": number 0-100,
    "techStackImpact": number 0-100,
    "codeQuality": number 0-100,
    "structure": number 0-100
  },
  "strengths": string[],
  "weaknesses": string[],
  "actionableFixes": [
    { "title": string, "impact": "High" | "Medium" | "Low", "suggestedCodeOrText": string }
  ]
}

Rules:
- Be specific and concrete. Reference actual skills, sections, or lines.
- actionableFixes must offer copy-paste-ready text or code.
- Keep strengths/weaknesses to at most 6 each.
- No explanations outside the JSON.`;

interface AiRequestBody {
  resumeText?: string;
  githubUrl?: string;
  codeSnippet?: string;
}

async function callAiApi(payload: AiRequestBody): Promise<unknown> {
  const model = process.env.AI_MODEL_NAME;
  const baseUrl = process.env.AI_BASE_URL;
  const apiKey = process.env.AI_API_KEY;

  if (!model || !baseUrl || !apiKey) {
    throw new Error("AI provider is not configured on the server.");
  }

  const userContent = [
    payload.resumeText ? `RESUME TEXT:\n${payload.resumeText.slice(0, 8000)}` : "",
    payload.githubUrl ? `GITHUB REPO URL: ${payload.githubUrl}` : "",
    payload.codeSnippet ? `CODE:\n${payload.codeSnippet.slice(0, 8000)}` : "",
  ]
    .filter(Boolean)
    .join("\n\n");

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: PROMPT },
        { role: "user", content: userContent },
      ],
      response_format: { type: "json_object" },
    }),
    signal: AbortSignal.timeout(60_000),
  });

  if (!response.ok) {
    throw new Error(`AI API responded with status ${response.status}`);
  }

  const data = await response.json();
  const content: string = data?.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("AI API returned an empty response.");
  }

  return JSON.parse(content);
}

export interface ReviewResult {
  review: z.infer<typeof reviewSchema>;
  usedFallback: boolean;
  message?: string;
}

export async function analyzeSubmission(
  input: {
    resumeText?: string;
    githubUrl?: string;
    codeSnippet?: string;
  },
): Promise<ReviewResult> {
  try {
    const raw = await callAiApi(input);
    const parsed = reviewSchema.parse(raw);
    return { review: parsed, usedFallback: false };
  } catch (error) {
    console.error("[analyzeSubmission] falling back to mock:", error);
    return {
      review: mockReviewData,
      usedFallback: true,
      message:
        "The AI service is unavailable (rate limit or configuration issue). Showing a sample analysis so the flow remains usable.",
    };
  }
}