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
    <div className="flex flex-1 flex-col">
      <main className="mx-auto w-full max-w-5xl flex-1 px-5 pb-8 pt-10 sm:px-6 sm:pt-12">
        {!result ? (
          <div className="grid gap-12 lg:grid-cols-[1.02fr_1fr] lg:items-start">
            <section aria-labelledby="hero-title" className="anim-rise lg:sticky lg:top-28">
              <p className="inline-flex items-center gap-2 rounded-full border border-hairline bg-surface px-3 py-1 font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-accent">
                <span
                  className="h-1.5 w-1.5 rounded-full bg-accent"
                  aria-hidden="true"
                />
                AI reviewer
              </p>

              <h1
                id="hero-title"
                className="mt-6 max-w-md text-balance font-display text-4xl leading-[1.05] font-semibold tracking-tight text-ink sm:text-5xl"
              >
                The review job applications never get
              </h1>

              <p className="mt-5 max-w-md text-base leading-7 text-muted">
                Upload a resume PDF, link a GitHub repo, or paste a snippet. Get
                a structured scorecard — ATS fit, tech-stack impact, code
                quality, structure — with fixes you can apply today.
              </p>

              <ol className="mt-10 grid gap-5">
                <li className="flex gap-4">
                  <span
                    className="font-mono text-sm font-semibold text-faint"
                    aria-hidden="true"
                  >
                    01
                  </span>
                  <div>
                    <h2 className="text-sm font-semibold text-ink">
                      Drop in your material
                    </h2>
                    <p className="mt-1 text-sm leading-6 text-muted">
                      A resume PDF, a GitHub link, or a code snippet — PDFs are
                      parsed in your browser and never leave your device.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span
                    className="font-mono text-sm font-semibold text-faint"
                    aria-hidden="true"
                  >
                    02
                  </span>
                  <div>
                    <h2 className="text-sm font-semibold text-ink">
                      Get a structured scorecard
                    </h2>
                    <p className="mt-1 text-sm leading-6 text-muted">
                      An LLM grades every section against a strict schema — one
                      overall score plus four category scores.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span
                    className="font-mono text-sm font-semibold text-faint"
                    aria-hidden="true"
                  >
                    03
                  </span>
                  <div>
                    <h2 className="text-sm font-semibold text-ink">
                      Apply the fixes, re-submit
                    </h2>
                    <p className="mt-1 text-sm leading-6 text-muted">
                      Actionable fixes come with suggested copy or code — copy
                      them straight into your application.
                    </p>
                  </div>
                </li>
              </ol>
            </section>

            <section
              aria-label="Start a review"
              className="anim-rise [animation-delay:120ms]"
            >
              <div className="rounded-[1.75rem] bg-canvas p-1.5 sm:rounded-[2rem]">
                <div className="rounded-[1.375rem] border border-hairline bg-surface p-5 shadow-sm sm:rounded-[1.625rem] sm:p-7">
                  <div className="mb-6 flex items-baseline justify-between">
                    <h2 className="font-display text-xl font-semibold text-ink">
                      Start a review
                    </h2>
                    <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-faint">
                      local, private
                    </span>
                  </div>

                  <AnalyzeForm onSubmit={handleAnalyze} loading={loading} />
                  {error && (
                    <p role="alert" className="mt-4 text-sm text-danger">
                      {error}
                    </p>
                  )}
                </div>
              </div>
            </section>
          </div>
        ) : (
          <section aria-label="Your review" className="anim-rise">
            <div className="grid gap-8">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-accent">
                    Scorecard
                  </p>
                  <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
                    Your review
                  </h1>
                </div>
                <button
                  type="button"
                  onClick={handleReset}
                  className="rounded-full border border-hairline px-4 py-2 text-sm font-medium text-muted transition-colors hover:border-hairline2 hover:text-ink active:scale-[0.98]"
                >
                  Review another
                </button>
              </div>

              {result.usedFallback && (
                <div
                  role="status"
                  className="rounded-xl border border-warn-soft bg-warn-soft px-4 py-3 text-sm text-warn"
                >
                  {result.message}
                </div>
              )}

              <div className="rounded-[1.75rem] bg-canvas p-1.5 sm:rounded-[2rem]">
                <div className="grid gap-10 rounded-[1.375rem] border border-hairline bg-surface p-5 shadow-sm sm:rounded-[1.625rem] sm:p-8 lg:grid-cols-[minmax(0,280px)_1fr]">
                  <ScoreGauge
                    score={result.review.overallScore}
                    categoryScores={result.review.categoryScores}
                  />
                  <ReviewDashboard review={result.review} />
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}