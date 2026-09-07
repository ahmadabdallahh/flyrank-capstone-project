import { describe, it, expect, vi, beforeEach } from "vitest";
import { validatePdfFile } from "@/lib/pdf";

function makeFile({
  name = "resume.pdf",
  type = "application/pdf",
  size = 1024,
}: {
  name?: string;
  type?: string;
  size?: number;
} = {}) {
  return {
    name,
    type,
    size,
    arrayBuffer: vi.fn().mockResolvedValue(new ArrayBuffer(8)),
  } as unknown as File;
}

describe("validatePdfFile", () => {
  it("accepts a valid PDF file", () => {
    expect(() => validatePdfFile(makeFile())).not.toThrow();
  });

  it("throws NO_FILE when file is missing", () => {
    try {
      validatePdfFile(null as unknown as File);
    } catch (error) {
      expect((error as Error).message).toMatch(/No file/i);
      expect((error as { code?: string }).code).toBe("NO_FILE");
    }
  });

  it("throws TOO_LARGE for files over 5MB", () => {
    try {
      validatePdfFile(makeFile({ size: 6 * 1024 * 1024 }));
    } catch (error) {
      expect((error as Error).message).toMatch(/5MB/i);
      expect((error as { code?: string }).code).toBe("TOO_LARGE");
    }
  });

  it("throws NOT_PDF for non-PDF files", () => {
    try {
      validatePdfFile(makeFile({ name: "resume.txt", type: "text/plain" }));
    } catch (error) {
      expect((error as Error).message).toMatch(/PDF/i);
      expect((error as { code?: string }).code).toBe("NOT_PDF");
    }
  });
});

describe("extractTextFromPdf", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it("returns extracted text from a parsed PDF", async () => {
    const mockPdf = {
      numPages: 2,
      getPage: vi
        .fn()
        .mockResolvedValue({
          getTextContent: vi.fn().mockResolvedValue({
            items: [{ str: "Hello" }, { str: "world" }],
          }),
        }),
    };
    const mockPdfjs = {
      GlobalWorkerOptions: {},
      getDocument: vi.fn().mockReturnValue({ promise: Promise.resolve(mockPdf) }),
    };

    vi.doMock("pdfjs-dist", () => mockPdfjs);

    const { extractTextFromPdf } = await import("@/lib/pdf");
    const text = await extractTextFromPdf(makeFile());
    expect(text).toBe("Hello world\nHello world");
  });
});