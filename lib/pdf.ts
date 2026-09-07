export interface PdfParseError extends Error {
  code?: "NO_FILE" | "TOO_LARGE" | "NOT_PDF" | "EMPTY" | "PARSE_FAILED";
}

const MAX_FILE_SIZE = 5 * 1024 * 1024;

function createError(message: string, code: PdfParseError["code"]): PdfParseError {
  const err = new Error(message) as PdfParseError;
  err.code = code;
  return err;
}

export function validatePdfFile(file: File): void {
  if (!file) {
    throw createError("No file selected.", "NO_FILE");
  }
  if (file.size > MAX_FILE_SIZE) {
    throw createError(
      `File is ${(file.size / 1024 / 1024).toFixed(1)}MB. Maximum allowed is 5MB.`,
      "TOO_LARGE",
    );
  }
  if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
    throw createError("Unsupported file type. Upload a PDF.", "NOT_PDF");
  }
}

export async function extractTextFromPdf(file: File): Promise<string> {
  validatePdfFile(file);

  const pdfjs = await import("pdfjs-dist");
  const globalWorker = pdfjs.GlobalWorkerOptions;
  globalWorker.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url,
  ).toString();

  const arrayBuffer = await file.arrayBuffer();
  let text = "";

  try {
    const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
    const pages = await Promise.all(
      Array.from({ length: pdf.numPages }, (_, i) => pdf.getPage(i + 1)),
    );
    const pageTexts = await Promise.all(
      pages.map((page) => page.getTextContent()),
    );

    for (const content of pageTexts) {
      const pageText = content.items
        .map((item) => ("str" in item ? item.str : ""))
        .join(" ");
      text += pageText + "\n";
    }
  } catch (error) {
    throw createError(
      `Could not read this PDF: ${
        error instanceof Error ? error.message : "unknown error"
      }`,
      "PARSE_FAILED",
    );
  }

  const trimmed = text.trim();
  if (!trimmed) {
    throw createError("No text could be extracted from this PDF.", "EMPTY");
  }

  return trimmed;
}