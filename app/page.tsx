"use client";

import { useState } from "react";
import { AnalyzeForm } from "@/components/analyze-form";
import { ScoreGauge } from "@/components/score-gauge";
import { ReviewDashboard } from "@/components/review-dashboard";
import { analyzeSubmission, type ReviewResult } from "@/lib/ai/analyze";

export default function HomePage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ReviewResult | null>(null);
  const [error, setError] = useState<string>("");

  async function handleAnalyze(input: {
    resumeText?: string;
    githubUrl?: string;
    codeSnippet?: string;
    fileName?: string;
  }) {
    setLoading(true);
    setError("");
    try {
      const res = await analyzeSubmission({
        resumeText: input.resumeText,
        githubUrl: input.githubUrl,
        codeSnippet: input.codeSnippet,
      });
      setResult(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setResult(null);
    setError("");
  }

  return (
    <div className="flex flex-1 flex-col bg-zinc-50 font-sans dark:bg-black">
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-12 sm:px-6">
        <header className="mb-10 grid gap-2">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            AI Smart Code &amp; Resume Reviewer
          </h1>
          <p className="max-w-2xl text-base leading-7 text-zinc-600 dark:text-zinc-400">
            Upload a resume PDF, paste a GitHub link, or drop in a code snippet.
            The AI returns a structured, actionable review — ATS score, strengths,
            weaknesses, and copy-paste-ready fixes.
          </p>
        </header>

        {!result ? (
          <section className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <AnalyzeForm onSubmit={handleAnalyze} loading={loading} />
            {error && (
              <p role="alert" className="mt-4 text-sm text-red-600">
                {error}
              </p>
            )}
          </section>
        ) : (
          <section className="grid gap-8">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
                Your review
              </h2>
              <button
                type="button"
                onClick={handleReset}
                className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                Review another
              </button>
            </div>

            {result.usedFallback && (
              <p
                role="status"
                className="rounded-md bg-amber-50 p-3 text-sm text-amber-800 dark:bg-amber-900/30 dark:text-amber-200"
              >
                {result.message}
              </p>
            )}

            <ScoreGauge
              score={result.review.overallScore}
              categoryScores={result.review.categoryScores}
            />
            <ReviewDashboard review={result.review} />
          </section>
        )}
      </main>
    </div>
  );
}