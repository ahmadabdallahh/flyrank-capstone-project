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
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            Settings
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Manage your account preferences and notification settings.
          </p>
        </header>

        <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
          <SettingsForm onSubmit={handleSubmit} />

          {saved && (
            <div
              role="status"
              aria-live="polite"
              className="mt-4 rounded-md bg-green-50 p-3 text-sm text-green-700 dark:bg-green-900/30 dark:text-green-400"
            >
              Settings saved successfully.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
