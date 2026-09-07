"use client";

import { useState } from "react";
import type { ReviewData } from "@/lib/validations/review";

interface ReviewDashboardProps {
  review: ReviewData;
}

const TABS = [
  { id: "strengths", label: "Strengths" },
  { id: "weaknesses", label: "Weaknesses" },
  { id: "fixes", label: "Actionable Fixes" },
] as const;

type TabId = (typeof TABS)[number]["id"];

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
      <div role="tablist" aria-label="Review sections" className="flex flex-wrap gap-2">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            id={`tab-${tab.id}`}
            aria-selected={activeTab === tab.id}
            aria-controls={`panel-${tab.id}`}
            onClick={() => setActiveTab(tab.id)}
            className={
              activeTab === tab.id
                ? "rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white focus-visible:outline-2 focus-visible:outline-offset-2"
                : "rounded-md bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-200 focus-visible:outline-2 focus-visible:outline-offset-2"
            }
          >
            {tab.label}
          </button>
        ))}
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
              <li key={i} className="rounded-md border border-gray-200 p-3 text-sm">
                <span className="mr-2 inline-block w-5 text-green-700">+</span>
                {s}
              </li>
            ))}
          </ul>
        )}

        {activeTab === "weaknesses" && (
          <ul className="grid gap-3">
            {review.weaknesses.map((w, i) => (
              <li key={i} className="rounded-md border border-gray-200 p-3 text-sm">
                <span className="mr-2 inline-block w-5 text-red-700">-</span>
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
                <li key={id} className="rounded-md border border-gray-200 p-4 grid gap-2">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-sm font-semibold">{fix.title}</h3>
                    <span
                      className={
                        fix.impact === "High"
                          ? "rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800"
                          : fix.impact === "Medium"
                            ? "rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-800"
                            : "rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700"
                      }
                    >
                      {fix.impact}
                    </span>
                  </div>
                  <pre className="whitespace-pre-wrap rounded-md bg-gray-900 p-3 text-xs text-gray-100">
                    {fix.suggestedCodeOrText}
                  </pre>
                  <button
                    type="button"
                    onClick={() => copyText(fix.suggestedCodeOrText, id)}
                    className="justify-self-start rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium hover:bg-gray-50 focus-visible:outline-2 focus-visible:outline-offset-2"
                    aria-live="polite"
                  >
                    {copiedId === id ? "Copied!" : "Copy"}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}