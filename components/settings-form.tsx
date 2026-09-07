"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { settingsSchema, type SettingsFormData } from "@/lib/validations/settings";

interface SettingsFormProps {
  initialData?: Partial<SettingsFormData>;
  onSubmit: (data: SettingsFormData) => void;
}

const INPUT_CLASS =
  "mt-1 block w-full rounded-xl border border-hairline2 bg-surface2 px-4 py-2.5 text-sm text-ink shadow-sm transition-colors focus:border-accent focus:outline-none";

export function SettingsForm({ initialData, onSubmit }: SettingsFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      name: initialData?.name ?? "",
      email: initialData?.email ?? "",
      theme: initialData?.theme ?? "system",
      notifications: initialData?.notifications ?? false,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid gap-6">
      <div className="grid gap-2">
        <label htmlFor="name" className="text-sm font-medium text-ink">
          Name
        </label>
        <input
          id="name"
          type="text"
          {...register("name")}
          aria-describedby={errors.name ? "name-error" : undefined}
          aria-invalid={errors.name ? "true" : "false"}
          className={INPUT_CLASS}
        />
        {errors.name && (
          <p id="name-error" role="alert" className="text-sm text-danger">
            {errors.name.message}
          </p>
        )}
      </div>

      <div className="grid gap-2">
        <label htmlFor="email" className="text-sm font-medium text-ink">
          Email
        </label>
        <input
          id="email"
          type="email"
          {...register("email")}
          aria-describedby={errors.email ? "email-error" : undefined}
          aria-invalid={errors.email ? "true" : "false"}
          className={INPUT_CLASS}
        />
        {errors.email && (
          <p id="email-error" role="alert" className="text-sm text-danger">
            {errors.email.message}
          </p>
        )}
      </div>

      <div className="grid gap-2">
        <label htmlFor="theme" className="text-sm font-medium text-ink">
          Theme
        </label>
        <select
          id="theme"
          {...register("theme")}
          aria-describedby={errors.theme ? "theme-error" : undefined}
          aria-invalid={errors.theme ? "true" : "false"}
          className={INPUT_CLASS}
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          <option value="system">System</option>
        </select>
        {errors.theme && (
          <p id="theme-error" role="alert" className="text-sm text-danger">
            {errors.theme.message}
          </p>
        )}
      </div>

      <div className="flex items-center gap-3">
        <input
          id="notifications"
          type="checkbox"
          {...register("notifications")}
          className="h-4.5 w-4.5 shrink-0 rounded border-hairline2 bg-surface2 text-accent accent-accent"
        />
        <label
          htmlFor="notifications"
          className="text-sm font-medium text-ink"
        >
          Enable email notifications
        </label>
      </div>

      <div className="pt-1">
        <button
          type="submit"
          disabled={isSubmitting}
          className="group flex w-full items-center justify-between gap-3 rounded-full bg-accent px-5 py-3 text-sm font-semibold text-accent-ink transition-all duration-200 hover:brightness-105 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Saving..." : "Save settings"}
          <span
            aria-hidden="true"
            className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-accent-ink/15 transition-transform duration-300 group-hover:translate-x-0.5"
          >
            <SaveGlyph />
          </span>
        </button>
      </div>
    </form>
  );
}

function SaveGlyph() {
  return (
    <svg
      viewBox="0 0 16 16"
      className="h-3.5 w-3.5"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M3 2.5h8.5L13 4.5v9H3z" strokeLinejoin="round" />
      <path d="M5 2.5V6h5V2.5M5 13.5V9h6v4.5" strokeLinejoin="round" />
    </svg>
  );
}