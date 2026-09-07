"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { reviewInputSchema, type ReviewInput } from "@/lib/validations/input";

type Mode = "resume" | "code";

interface AnalyzeFormProps {
  onSubmit: (input: {
    resumeText?: string;
    githubUrl?: string;
    codeSnippet?: string;
    fileName?: string;
  }) => Promise<void>;
  loading: boolean;
}

export function AnalyzeForm({ onSubmit, loading }: AnalyzeFormProps) {
  const [mode, setMode] = useState<Mode>("resume");
  const [fileName, setFileName] = useState<string>("");
  const [parseError, setParseError] = useState<string>("");
  const [isParsingPdf, setIsParsingPdf] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ReviewInput>({
    resolver: zodResolver(reviewInputSchema),
    defaultValues: { githubUrl: "", codeSnippet: "", resumeText: undefined },
  });

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    setParseError("");
    setFileName("");

    if (!file) return;

    // Reset the input so re-selecting the same file re-fires change
    event.target.value = "";

    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      setParseError("Unsupported file type. Upload a PDF.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setParseError(
        `File is ${(file.size / 1024 / 1024).toFixed(1)}MB. Maximum allowed is 5MB.`,
      );
      return;
    }

    setIsParsingPdf(true);
    try {
      const { extractTextFromPdf } = await import("@/lib/pdf");
      const text = await extractTextFromPdf(file);
      setValue("resumeText", text);
      setFileName(file.name);
    } catch (error) {
      setParseError(
        error instanceof Error ? error.message : "Could not read this PDF.",
      );
    } finally {
      setIsParsingPdf(false);
    }
  }

  const handleFormSubmit = handleSubmit(async (data) => {
    await onSubmit({
      resumeText: data.resumeText,
      githubUrl: data.githubUrl,
      codeSnippet: data.codeSnippet,
      fileName,
    });
  });

  return (
    <form onSubmit={handleFormSubmit} noValidate className="grid gap-6">
      <fieldset className="grid gap-2">
        <legend className="font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-faint">
          What are we reviewing?
        </legend>
        <div className="grid grid-cols-2 gap-1.5 rounded-full bg-canvas p-1.5" role="radiogroup">
          <label
            className={`relative cursor-pointer rounded-full px-4 py-2 text-center text-sm font-medium transition-colors duration-200 ${
              mode === "resume"
                ? "bg-accent text-accent-ink"
                : "text-muted hover:text-ink"
            }`}
          >
            <input
              type="radio"
              name="mode"
              value="resume"
              checked={mode === "resume"}
              onChange={() => setMode("resume")}
              className="sr-only"
            />
            Resume PDF
          </label>
          <label
            className={`relative cursor-pointer rounded-full px-4 py-2 text-center text-sm font-medium transition-colors duration-200 ${
              mode === "code"
                ? "bg-accent text-accent-ink"
                : "text-muted hover:text-ink"
            }`}
          >
            <input
              type="radio"
              name="mode"
              value="code"
              checked={mode === "code"}
              onChange={() => setMode("code")}
              className="sr-only"
            />
            Code / GitHub
          </label>
        </div>
      </fieldset>

      {mode === "resume" && (
        <div className="grid gap-2">
          <label
            htmlFor="pdf-upload"
            className={`grid cursor-pointer place-items-center gap-3 rounded-2xl border-2 border-dashed p-6 text-center transition-colors duration-200 hover:border-accent hover:bg-accent-soft/40 ${
              fileName ? "border-pass-soft bg-pass-soft/30" : "border-hairline2"
            }`}
          >
            <span aria-hidden="true" className="text-2xl">
              {fileName ? "✓" : "↑"}
            </span>
            <span className="text-sm font-medium text-ink">
              {isParsingPdf
                ? "Extracting PDF text..."
                : fileName
                  ? `Loaded: ${fileName}`
                  : "Drop your resume PDF here, or click to browse"}
            </span>
            <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-faint">
              PDF only · max 5MB · parsed in your browser
            </span>
            <input
              id="pdf-upload"
              type="file"
              accept="application/pdf,.pdf"
              onChange={handleFileChange}
              aria-describedby={parseError ? "pdf-error" : undefined}
              aria-invalid={parseError ? "true" : "false"}
              className="sr-only"
            />
          </label>
          <p id="pdf-hint" className="sr-only">
            PDF only, max 5MB. Parsed in your browser.
          </p>
          {parseError && (
            <p id="pdf-error" role="alert" className="text-sm text-danger">
              {parseError}
            </p>
          )}
        </div>
      )}

      {mode === "code" && (
        <div className="grid gap-4">
          <div className="grid gap-2">
            <label htmlFor="github-url" className="text-sm font-medium text-ink">
              GitHub repository URL
              <span className="ml-1 font-mono text-[11px] uppercase tracking-[0.12em] text-faint">
                optional
              </span>
            </label>
            <input
              id="github-url"
              type="url"
              placeholder="https://github.com/user/repo"
              className="w-full rounded-xl border border-hairline2 bg-surface2 px-4 py-2.5 font-mono text-sm text-ink placeholder:text-faint focus:border-accent focus:outline-none"
              {...register("githubUrl")}
              aria-invalid={errors.githubUrl ? "true" : "false"}
              aria-describedby={errors.githubUrl ? "github-url-error" : undefined}
            />
            {errors.githubUrl && (
              <p id="github-url-error" role="alert" className="text-sm text-danger">
                {errors.githubUrl.message}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <label htmlFor="code-snippet" className="text-sm font-medium text-ink">
              Or paste a code snippet
              <span className="ml-1 font-mono text-[11px] uppercase tracking-[0.12em] text-faint">
                optional
              </span>
            </label>
            <textarea
              id="code-snippet"
              rows={8}
              placeholder="Paste HTML, CSS, TSX, or JS here..."
              className="w-full resize-y rounded-xl border border-hairline2 bg-surface2 px-4 py-3 font-mono text-sm text-ink placeholder:text-faint focus:border-accent focus:outline-none"
              {...register("codeSnippet")}
              aria-invalid={errors.codeSnippet ? "true" : "false"}
              aria-describedby={errors.codeSnippet ? "code-snippet-error" : undefined}
            />
            {errors.codeSnippet && (
              <p id="code-snippet-error" role="alert" className="text-sm text-danger">
                {errors.codeSnippet.message}
              </p>
            )}
          </div>
        </div>
      )}

      {mode === "resume" && (
        <div className="grid gap-2">
          <label
            htmlFor="code-snippet-resume"
            className="text-sm font-medium text-ink"
          >
            Add a GitHub link or code snippet too
            <span className="ml-1 font-mono text-[11px] uppercase tracking-[0.12em] text-faint">
              optional
            </span>
          </label>
          <textarea
            id="code-snippet-resume"
            rows={4}
            placeholder="https://github.com/user/repo or paste code..."
            className="w-full resize-y rounded-xl border border-hairline2 bg-surface2 px-4 py-3 font-mono text-sm text-ink placeholder:text-faint focus:border-accent focus:outline-none"
            {...register("codeSnippet")}
            aria-invalid={errors.codeSnippet ? "true" : "false"}
            aria-describedby={errors.codeSnippet ? "code-snippet-error" : undefined}
          />
          {errors.codeSnippet && (
            <p id="code-snippet-error" role="alert" className="text-sm text-danger">
              {errors.codeSnippet.message}
            </p>
          )}
        </div>
      )}

      <div className="pt-1">
        <button
          type="submit"
          disabled={loading || isParsingPdf}
          className="group flex w-full items-center justify-between gap-3 rounded-full bg-accent px-5 py-3 text-sm font-semibold text-accent-ink transition-all duration-200 hover:brightness-105 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-60"
        >
          <span className="flex items-center gap-2">
            {loading ? (
              <>
                <SpinnerIcon />
                Reviewing...
              </>
            ) : (
              "Run review"
            )}
          </span>
          <span
            aria-hidden="true"
            className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-accent-ink/15 transition-transform duration-300 group-hover:translate-x-0.5"
          >
            <ArrowIcon />
          </span>
        </button>
      </div>
    </form>
  );
}

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      className="h-3.5 w-3.5"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
    >
      <path d="M2 8h11M9 3l5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SpinnerIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      className="h-4 w-4 animate-spin"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <circle cx="8" cy="8" r="6" opacity="0.35" />
      <path d="M14 8a6 6 0 0 0-6-6" strokeLinecap="round" />
    </svg>
  );
}