"use client";

import { useState } from "react";
import { SettingsForm } from "@/components/settings-form";
import type { SettingsFormData } from "@/lib/validations/settings";

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);

  const handleSubmit = (data: SettingsFormData) => {
    console.log("Settings saved:", data);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="mx-auto w-full max-w-2xl flex-1 px-5 py-12 sm:px-6">
      <header className="anim-rise mb-8">
        <p className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-accent">
          Preferences
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-ink">
          Settings
        </h1>
        <p className="mt-2 text-sm leading-6 text-muted">
          Manage your account preferences and notification settings.
        </p>
      </header>

      <section
        aria-label="Settings"
        className="anim-rise [animation-delay:120ms]"
      >
        <div className="rounded-[1.75rem] bg-canvas p-1.5 sm:rounded-[2rem]">
          <div className="rounded-[1.375rem] border border-hairline bg-surface p-5 shadow-sm sm:rounded-[1.625rem] sm:p-7">
            <SettingsForm onSubmit={handleSubmit} />

            {saved && (
              <div
                role="status"
                aria-live="polite"
                className="mt-5 flex items-center gap-2 rounded-xl border border-pass-soft bg-pass-soft px-4 py-3 text-sm text-pass"
              >
                <CheckIcon />
                Settings saved successfully.
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      className="h-4 w-4"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
    >
      <path d="M2.5 8.5l3.5 3.5 7.5-7.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}