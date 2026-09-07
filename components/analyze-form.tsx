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
        <legend className="text-sm font-medium">What do you want reviewed?</legend>
        <div className="flex gap-2">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="mode"
              value="resume"
              checked={mode === "resume"}
              onChange={() => setMode("resume")}
            />
            Resume PDF
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="mode"
              value="code"
              checked={mode === "code"}
              onChange={() => setMode("code")}
            />
            Code / GitHub
          </label>
        </div>
      </fieldset>

      {mode === "resume" && (
        <div className="grid gap-2">
          <label
            htmlFor="pdf-upload"
            className="block text-sm font-medium"
          >
            Resume PDF
          </label>
          <input
            id="pdf-upload"
            type="file"
            accept="application/pdf,.pdf"
            onChange={handleFileChange}
            aria-describedby={parseError ? "pdf-error" : "pdf-hint"}
            aria-invalid={parseError ? "true" : "false"}
            className="block w-full cursor-pointer rounded-md border border-gray-300 p-2 text-sm"
          />
          <p id="pdf-hint" className="text-xs text-gray-500">
            PDF only, max 5MB. Parsed in your browser.
          </p>
          {isParsingPdf && (
            <p role="status" className="text-sm text-blue-600">
              Extracting PDF text...
            </p>
          )}
          {fileName && (
            <p className="text-xs text-green-700">
              Loaded: {fileName}
            </p>
          )}
          {parseError && (
            <p id="pdf-error" role="alert" className="text-sm text-red-600">
              {parseError}
            </p>
          )}
        </div>
      )}

      {mode === "code" && (
        <div className="grid gap-4">
          <div className="grid gap-2">
            <label htmlFor="github-url" className="block text-sm font-medium">
              GitHub repository URL (optional)
            </label>
            <input
              id="github-url"
              type="url"
              placeholder="https://github.com/user/repo"
              className="w-full rounded-md border border-gray-300 p-2 text-sm"
              {...register("githubUrl")}
              aria-invalid={errors.githubUrl ? "true" : "false"}
              aria-describedby={errors.githubUrl ? "github-url-error" : undefined}
            />
            {errors.githubUrl && (
              <p id="github-url-error" role="alert" className="text-sm text-red-600">
                {errors.githubUrl.message}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <label htmlFor="code-snippet" className="block text-sm font-medium">
              Or paste a code snippet (optional)
            </label>
            <textarea
              id="code-snippet"
              rows={8}
              placeholder="Paste HTML, CSS, TSX, or JS here..."
              className="w-full rounded-md border border-gray-300 p-2 font-mono text-sm"
              {...register("codeSnippet")}
              aria-invalid={errors.codeSnippet ? "true" : "false"}
              aria-describedby={errors.codeSnippet ? "code-snippet-error" : undefined}
            />
            {errors.codeSnippet && (
              <p id="code-snippet-error" role="alert" className="text-sm text-red-600">
                {errors.codeSnippet.message}
              </p>
            )}
          </div>
        </div>
      )}

      {mode === "resume" && (
        <div className="grid gap-4">
          <div className="grid gap-2">
            <label htmlFor="code-snippet-resume" className="block text-sm font-medium">
              Or add a GitHub link / code snippet too (optional)
            </label>
            <textarea
              id="code-snippet-resume"
              rows={5}
              placeholder="https://github.com/user/repo or paste code..."
              className="w-full rounded-md border border-gray-300 p-2 font-mono text-sm"
              {...register("codeSnippet")}
              aria-invalid={errors.codeSnippet ? "true" : "false"}
              aria-describedby={errors.codeSnippet ? "code-snippet-error" : undefined}
            />
            {errors.codeSnippet && (
              <p id="code-snippet-error" role="alert" className="text-sm text-red-600">
                {errors.codeSnippet.message}
              </p>
            )}
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={loading || isParsingPdf}
        className="w-full rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Analyzing..." : "Run Review"}
      </button>
    </form>
  );
}