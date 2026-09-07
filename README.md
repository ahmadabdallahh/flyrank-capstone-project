# Front End Internship Capstone

A front-end development capstone project built with Next.js, React, and AI-assisted development workflows. This project demonstrates how directing AI with precise specs, verification loops, and code review produces better results than vague prompting.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 16](https://nextjs.org/) (App Router) |
| UI Library | [React 19](https://react.dev/) |
| Styling | [Tailwind CSS 4](https://tailwindcss.com/) |
| Language | [TypeScript 5](https://www.typescriptlang.org/) |
| Forms | [react-hook-form](https://react-hook-form.com/) + [zod](https://zod.dev/) |
| Package Manager | [bun](https://bun.sh/) |
| AI Tools | [opencode](https://opencode.ai), [Claude Code](https://docs.anthropic.com/en/docs/claude-code) |

## Prerequisites

- [Node.js](https://nodejs.org/) v18+ (LTS recommended)
- [bun](https://bun.sh/) (package manager)
- [Git](https://git-scm.com/)
- A code editor (VS Code recommended)

## Getting Started

```bash
# Clone the repository
git clone <repository-url>
cd capastone-final-project

# Install dependencies
bun install

# Start the dev server
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page
│   ├── globals.css         # Global styles
│   └── settings/           # Settings route
│       └── page.tsx
├── components/             # Reusable UI components
│   └── settings-form.tsx
├── lib/                    # Utilities and configurations
│   └── validations/        # Zod schemas + TypeScript types
│       └── settings.ts
├── public/                 # Static assets
├── AGENTS.md               # Project rules and AI instructions
├── CLAUDE.md               # AI assistant conventions (build context / identity kit)
├── WORKFLOW.md             # AI workflow comparison analysis
├── NEXT-CASE.md            # Runbook: how to add the next portfolio case study
├── TODO.md                 # Tracked reminder: the next named piece + nudge
└── package.json
```

## Case Studies

This repo doubles as a portfolio of applied front-end work. Each case follows a
three-beat shape (Problem / What you did / What came of it). To add the next
one, follow [`NEXT-CASE.md`](./NEXT-CASE.md); the next named piece is tracked
in [`TODO.md`](./TODO.md).

- **Case 1 — AI Workflow Comparison (Settings Form):** See `WORKFLOW.md` and the
  `round-1-vague` vs `round-2-precise` branches.

## Available Scripts

```bash
bun run dev        # Start development server
bun run build      # Build for production
bun run start      # Start production server
bun run lint       # Run ESLint
```

## Development Workflow

This project follows an AI-assisted development workflow with strict conventions:

1. **Plan before code** — Define the feature, constraints, and verification steps
2. **Write precise prompts** — Reference files, specify libraries, define behavior
3. **Verify after generation** — Run `bun run lint` and `bun run build` before committing
4. **Review and iterate** — Critique AI output against the project's rules in `AGENTS.md`

### Key Rules

- Forms use **react-hook-form + zod** — never uncontrolled inputs
- Every input has **proper labeling and ARIA attributes**
- Validation schemas live in **`lib/validations/`**
- Errors use **`role="alert"`**, never `alert()` dialogs
- Run **lint + build** before every commit

See [`AGENTS.md`](./AGENTS.md) for the complete ruleset.

## Branches

| Branch | Description |
|---|---|
| `main` | Production-ready code |
| `round-1-vague` | Settings form built with a vague prompt (no validation, no a11y) |
| `round-2-precise` | Settings form built with a precise prompt (react-hook-form, zod, full a11y) |

Compare branches to see the difference between vague and precise AI prompting:

```bash
git diff round-1-vague..round-2-precise
```

See [`WORKFLOW.md`](./WORKFLOW.md) for the full analysis.

## AI-Assisted Development

This project uses AI as a development tool, not a replacement for engineering judgment. The workflow is:

- **AI generates** — based on precise specs with file references and constraints
- **Human verifies** — runs tests, checks accessibility, reviews logic
- **Human decides** — what to keep, what to change, what to discard

The goal is to make the AI's contribution visible and the human's direction decisive.

## License

MIT
