# AI Smart Code & Resume Reviewer

A production-ready, AI-enhanced frontend application that gives junior and
mid-level web developers structured, actionable feedback on their resumes and
code. Upload a resume PDF, paste a GitHub link, or drop in a code snippet — the
app extracts text, sends it to an LLM with a strict Zod schema, and returns a
score gauge, strengths, weaknesses, and copy-paste-ready fixes.

Built with Next.js, React, TypeScript, Tailwind CSS, and a resilient AI
pipeline with mock fallbacks. AI-assisted from spec to ship.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 16](https://nextjs.org/) (App Router) |
| UI Library | [React 19](https://react.dev/) |
| Styling | [Tailwind CSS 4](https://tailwindcss.com/) |
| Language | [TypeScript 5](https://www.typescriptlang.org/) |
| Forms | [react-hook-form](https://react-hook-form.com/) + [zod](https://zod.dev/) |
| PDF Parsing | [pdfjs-dist](https://github.com/mozilla/pdf.js) (client-side) |
| Testing | [Vitest](https://vitest.dev/) + React Testing Library |
| Package Manager | [bun](https://bun.sh/) |
| AI Tools | [opencode](https://opencode.ai), [Claude Code](https://docs.anthropic.com/en/docs/claude-code) |

## Prerequisites

- [Node.js](https://nodejs.org/) v18+ (LTS recommended)
- [bun](https://bun.sh/) (package manager)
- [Git](https://git-scm.com/)

## Getting Started

```bash
# Clone the repository
git clone <repository-url>
cd capastone-final-project

# Install dependencies
bun install

# Configure AI (optional — without it, the app uses a bundled mock fallback)
cp .env.example .env.local   # then fill in your API key

# Start the dev server
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

Without valid AI credentials the app still works end-to-end using a local mock
analysis — the flow (upload → parse → gauge → fixes) is fully testable.

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home — the reviewer flow
│   └── settings/           # Settings route (workflow-comparison case study)
├── components/             # Reusable UI components
│   ├── analyze-form.tsx    # Accessible upload + GitHub/code form
│   ├── score-gauge.tsx     # Animated, accessible score display
│   └── review-dashboard.tsx# Tabs: strengths / weaknesses / fixes + copy
├── lib/
│   ├── ai/analyze.ts       # Server action: LLM structured output + fallback
│   ├── pdf.ts              # Client-side PDF text extraction (pdfjs-dist)
│   ├── mock-review.ts      # Bundled fallback analysis data
│   └── validations/        # Zod schemas + inferred types
│       ├── review.ts       # AI response schema + category labels
│       └── input.ts        # Form input validation (GitHub URL, code, resume)
├── vitest.config.ts        # Test + coverage config
├── ADD_NEXT_CASE.md        # Runbook: how to add the next portfolio case
└── package.json
```

## Architecture Overview

- **Client:** The home page manages the flow state. `AnalyzeForm` validates
  input (react-hook-form + zod) and parses PDFs entirely in the browser via
  `pdfjs-dist` (never uploads the file). `ScoreGauge` and `ReviewDashboard`
  render the structured result.
- **Server:** `analyzeSubmission` (a Next.js server action) builds a strict
  prompt, calls the LLM with JSON mode, and parses the response through a Zod
  schema. Any failure gracefully falls back to a bundled mock so users always
  get an analysis.
- **Validation:** Two schemas — one for user input (GitHub URL format, code
  snippet length, "at least one source" rule) and one enforcing the AI's
  structured JSON output (score range, category bounds, enum impact levels).

## AI Integration

- **What:** The app sends extracted resume text and/or code to the configured
  LLM with a `response_format: json_object` request plus a strict system prompt.
- **Why:** Resume/code feedback is only useful if it's structured and
  actionable. The Zod schema is the contract: the app refuses invalid AI output
  instead of rendering garbage, and falls back to a mock on failure.
- **Prompt:** A system prompt defines the exact output shape (overall score,
  four category scores, strengths, weaknesses, and high/medium/low fixes).
- **Resilience:** Times out after 60s, caps payloads at 8,000 chars, and always
  returns a valid review via the mock fallback even if the API is down or the
  key is missing.

## Testing

```bash
bun run test          # Run tests once
bun run test:watch    # Watch mode
bun run test:coverage # With coverage report
```

- **17 tests across 4 suites:** PDF validation, input schema, score gauge, and
  review dashboard.
- **Coverage:** ~90% statements / lines (requirement was ≥50%).
- Run `bun run lint` and `bun run build` before committing.

## Accessibility

- WCAG 2.1 AA-oriented: labeled inputs, `role="alert"` errors, `aria-live`
  feedback, `aria-invalid`, keyboard-navigable tabs (ARIA tab roles), visible
  focus indicators, and accessible progress bars with `aria-valuenow`.
- Color-coded scores are paired with text, never color alone.

## Deployment

- Deploy to Vercel (Next.js-native): push to `main`, or use the Vercel CLI.
- The deploy needs the `AI_MODEL_NAME`, `AI_BASE_URL`, and `AI_API_KEY`
  environment variables set in the Vercel project settings (or run with the
  bundled mock fallback).
- Rollback: redeploy the previous production deployment from the Vercel
  dashboard, or revert the `main` commit and push.

## Case Studies

Each case follows the three-beat shape (Problem / What you did / What came of
it). Add the next one via [`ADD_NEXT_CASE.md`](./ADD_NEXT_CASE.md).

- **Case 1 — AI Smart Code & Resume Reviewer:** this app. Problem: opaque
  rejection feedback for job-seekers. What I did: accessible Next.js app +
  structured LLM output via Zod. What came of it: 90%+ coverage, lint-clean
  build, live deploy.
- **Case 2 — AI Workflow Comparison (Settings Form):** see `WORKFLOW.md` and
  the `round-1-vague` vs `round-2-precise` branches.

## Available Scripts

```bash
bun run dev           # Start development server
bun run build         # Build for production
bun run start         # Start production server
bun run lint          # Run ESLint
bun run test          # Run Vitest tests
bun run test:coverage # Run tests with coverage report
```

## Notes

- Real API keys live in `.env.local` (gitignored). See `.env.example` for the
  template. Never commit keys.
- See [`AGENTS.md`](./AGENTS.md) for the full development ruleset.

## License

MIT