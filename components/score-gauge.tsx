"use client";

import type { CategoryKey } from "@/lib/validations/review";
import { CATEGORY_LABELS, CATEGORY_ORDER } from "@/lib/validations/review";

interface ScoreGaugeProps {
  score: number;
  categoryScores: Record<CategoryKey, number>;
}

function scoreColor(score: number): string {
  if (score >= 75) return "text-green-700";
  if (score >= 50) return "text-yellow-700";
  return "text-red-700";
}

function scoreBarColor(score: number): string {
  if (score >= 75) return "bg-green-600";
  if (score >= 50) return "bg-yellow-500";
  return "bg-red-600";
}

export function ScoreGauge({ score, categoryScores }: ScoreGaugeProps) {
  return (
    <section
      aria-label="Overall score and category breakdown"
      className="grid gap-6"
    >
      <div className="grid place-items-center gap-1 text-center">
        <p className="text-7xl font-black tabular-nums" style={{ color: "inherit" }}>
          <span className={scoreColor(score)}>{score}</span>
        </p>
        <p className="text-sm font-medium text-gray-600">of 100</p>
        <p className="sr-only">
          Overall score {score} out of 100.
        </p>
      </div>

      <div className="grid gap-4">
        {CATEGORY_ORDER.map((key) => {
          const value = categoryScores[key];
          return (
            <div key={key} className="grid gap-1">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-gray-700">
                  {CATEGORY_LABELS[key]}
                </span>
                <span className={`font-bold tabular-nums ${scoreColor(value)}`}>
                  {value}
                </span>
              </div>
              <div
                role="progressbar"
                aria-valuenow={value}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${CATEGORY_LABELS[key]} score`}
                className="h-2 w-full rounded-full bg-gray-200"
              >
                <div
                  className={`h-full rounded-full ${scoreBarColor(value)}`}
                  style={{ width: `${value}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}