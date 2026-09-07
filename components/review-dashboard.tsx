"use client";

import { useState } from "react";
import type { ReviewData } from "@/lib/validations/review";

interface ReviewDashboardProps {
  review: ReviewData;
}

const TABS = [
  { id: "fixes", label: "Actionable Fixes" },
  { id: "strengths", label: "Strengths" },
  { id: "weaknesses", label: "Weaknesses" },
] as const;

type TabId = (typeof TABS)[number]["id"];

const IMPACT_STYLE: Record<string, string> = {
  High: "border-danger-soft bg-danger-soft text-danger",
  Medium: "border-warn-soft bg-warn-soft text-warn",
  Low: "border-hairline bg-canvas text-muted",
};

export function ReviewDashboard({ review }: ReviewDashboardProps) {
  const [activeTab, setActiveTab] = useState<TabId>("fixes");
  const [copiedId, setCopiedId] = useState<string>("");

  async function copyText(text: string, id: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(""), 2000);
    } catch {
      // Clipboard may be unavailable; ignore
    }
  }

  return (
    <section aria-label="Analysis results" className="grid gap-6">
      <div
        role="tablist"
        aria-label="Review sections"
        className="flex flex-wrap gap-1 rounded-full bg-canvas p-1"
      >
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              role="tab"
              id={`tab-${tab.id}`}
              aria-selected={isActive}
              aria-controls={`panel-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                isActive
                  ? "bg-accent text-accent-ink"
                  : "text-muted hover:text-ink"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
        <span
          aria-hidden="true"
          className="ml-auto hidden items-center pl-2 pr-3 font-mono text-[11px] uppercase tracking-[0.14em] text-faint sm:flex"
        >
          {review.actionableFixes.length} fixes
        </span>
      </div>

      <div
        role="tabpanel"
        id={`panel-${activeTab}`}
        aria-labelledby={`tab-${activeTab}`}
        className="grid gap-3"
      >
        {activeTab === "strengths" && (
          <ul className="grid gap-3">
            {review.strengths.map((s, i) => (
              <li
                key={i}
                className="flex items-start gap-3 rounded-xl border border-hairline bg-surface2 p-4 text-sm leading-6 text-ink"
              >
                <span
                  aria-hidden="true"
                  className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-pass-soft font-mono text-xs font-bold text-pass"
                >
                  +
                </span>
                {s}
              </li>
            ))}
          </ul>
        )}

        {activeTab === "weaknesses" && (
          <ul className="grid gap-3">
            {review.weaknesses.map((w, i) => (
              <li
                key={i}
                className="flex items-start gap-3 rounded-xl border border-hairline bg-surface2 p-4 text-sm leading-6 text-ink"
              >
                <span
                  aria-hidden="true"
                  className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-danger-soft font-mono text-xs font-bold text-danger"
                >
                  −
                </span>
                {w}
              </li>
            ))}
          </ul>
        )}

        {activeTab === "fixes" && (
          <ul className="grid gap-4">
            {review.actionableFixes.map((fix, i) => {
              const id = `fix-${i}`;
              return (
                <li
                  key={id}
                  className="grid gap-3 rounded-xl border border-hairline bg-surface2 p-4 sm:p-5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h3 className="font-display text-sm font-semibold text-ink">
                      {fix.title}
                    </h3>
                    <span
                      className={`rounded-full border px-2.5 py-0.5 font-mono text-[11px] font-medium uppercase tracking-[0.1em] ${IMPACT_STYLE[fix.impact]}`}
                    >
                      {fix.impact}
                    </span>
                  </div>
                  <pre className="overflow-x-auto whitespace-pre-wrap rounded-lg bg-code p-4 font-mono text-xs leading-6 text-codeink">
                    {fix.suggestedCodeOrText}
                  </pre>
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-faint">
                      fix {String(i + 1).padStart(2, "0")}
                    </span>
                    <button
                      type="button"
                      onClick={() => copyText(fix.suggestedCodeOrText, id)}
                      className="flex items-center gap-2 rounded-full border border-hairline2 px-3 py-1.5 text-sm font-medium text-muted transition-colors hover:border-accent hover:text-accent active:scale-[0.98]"
                    >
                      {copiedId === id ? (
                        <span className="flex items-center gap-1.5 text-accent">
                          <CheckIcon /> Copied
                        </span>
                      ) : (
                        <>
                          <CopyIcon /> Copy
                        </>
                      )}
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}

function CopyIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      className="h-3.5 w-3.5"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <rect x="5.5" y="5.5" width="8" height="8" rx="1.5" />
      <path d="M10.5 5.5v-2a1 1 0 0 0-1-1h-6a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      className="h-3.5 w-3.5"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
    >
      <path d="M2.5 8.5l3.5 3.5 7.5-7.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}