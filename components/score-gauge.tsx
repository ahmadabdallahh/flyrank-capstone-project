"use client";

import type { CategoryKey } from "@/lib/validations/review";
import { CATEGORY_LABELS, CATEGORY_ORDER } from "@/lib/validations/review";

interface ScoreGaugeProps {
  score: number;
  categoryScores: Record<CategoryKey, number>;
}

const TICKS = Array.from({ length: 60 }, (_, i) => i);

function band(value: number): "pass" | "warn" | "danger" {
  if (value >= 75) return "pass";
  if (value >= 50) return "warn";
  return "danger";
}

const TEXT_CLASS: Record<"pass" | "warn" | "danger", string> = {
  pass: "text-pass",
  warn: "text-warn",
  danger: "text-danger",
};

const FILL_CLASS: Record<"pass" | "warn" | "danger", string> = {
  pass: "bg-pass",
  warn: "bg-warn",
  danger: "bg-danger",
};

export function ScoreGauge({ score, categoryScores }: ScoreGaugeProps) {
  const overallBand = band(score);
  const radius = 78;
  const circumference = 2 * Math.PI * radius;
  const fill = (circumference * score) / 100;

  return (
    <section
      aria-label="Overall score and category breakdown"
      className="grid gap-7 lg:sticky lg:top-28 lg:self-start"
    >
      <div className="grid justify-items-center gap-5">
        <div className="relative h-48 w-48">
          <svg
            viewBox="0 0 192 192"
            className="h-48 w-48 -rotate-90"
            aria-hidden="true"
            role="presentation"
          >
            <g stroke="currentColor" className="text-hairline" strokeWidth="2">
              {TICKS.map((i) => {
                const angle = (i / TICKS.length) * Math.PI * 2;
                const major = i % 5 === 0;
                const r1 = major ? 88 : 92;
                return (
                  <line
                    key={i}
                    x1={96 + Math.cos(angle) * r1}
                    y1={96 + Math.sin(angle) * r1}
                    x2={96 + Math.cos(angle) * 95}
                    y2={96 + Math.sin(angle) * 95}
                    strokeWidth={major ? 2 : 1}
                  />
                );
              })}
            </g>
            <circle
              cx="96"
              cy="96"
              r={radius}
              fill="none"
              strokeWidth="10"
              className="stroke-hairline"
            />
            <circle
              cx="96"
              cy="96"
              r={radius}
              fill="none"
              strokeWidth="10"
              strokeDasharray={`${fill} ${circumference}`}
              strokeLinecap="round"
              className={`stroke-current ${TEXT_CLASS[overallBand]}`}
            />
          </svg>

          <div className="absolute inset-0 grid place-items-center">
            <div className="text-center">
              <p
                className={`font-mono text-6xl font-bold tabular-nums tracking-tight ${TEXT_CLASS[overallBand]}`}
              >
                {score}
              </p>
              <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.18em] text-faint">
                of 100
              </p>
            </div>
          </div>
          <p className="sr-only">
            Overall score {score} out of 100.
          </p>
        </div>

        <p
          className={`rounded-full border px-3 py-1 font-mono text-[11px] font-medium uppercase tracking-[0.16em] ${
            overallBand === "pass"
              ? "border-pass-soft bg-pass-soft text-pass"
              : overallBand === "warn"
                ? "border-warn-soft bg-warn-soft text-warn"
                : "border-danger-soft bg-danger-soft text-danger"
          }`}
        >
          {overallBand === "pass"
            ? "Hire-ready"
            : overallBand === "warn"
              ? "Needs work"
              : "Major gaps"}
        </p>
      </div>

      <div className="grid gap-5">
        {CATEGORY_ORDER.map((key) => {
          const value = categoryScores[key];
          return (
            <div key={key} className="grid gap-1.5">
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-sm font-medium text-ink">
                  {CATEGORY_LABELS[key]}
                </span>
                <span
                  className={`font-mono text-sm font-semibold tabular-nums ${TEXT_CLASS[band(value)]}`}
                >
                  {value}
                </span>
              </div>
              <div
                role="progressbar"
                aria-valuenow={value}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${CATEGORY_LABELS[key]} score`}
                className="h-1.5 w-full overflow-hidden rounded-full bg-canvas"
              >
                <div
                  className={`h-full rounded-full ${FILL_CLASS[band(value)]}`}
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