# AGENTS.md — Project Rules & Instructions

## Project Overview

Front End Internship Capstone — a Next.js 16 + React 19 + Tailwind CSS 4 + TypeScript project built with AI-assisted development workflows.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI Library | React 19 |
| Styling | Tailwind CSS 4 |
| Language | TypeScript 5 |
| Forms | react-hook-form + zod |
| Package Manager | bun |
| AI Tools | opencode, Claude Code |

---

## Code Style

- Use **semantic HTML** elements (`<header>`, `<main>`, `<section>`, `<nav>`, `<article>`)
- Follow **BEM methodology** for CSS class naming when not using Tailwind
- Use `const` and `let` instead of `var`
- Prefer **arrow functions** for anonymous functions
- Use **template literals** for string interpolation
- Use **named exports** for components, not default exports (except pages/layouts)
- Keep components under **150 lines** — extract subcomponents if larger

---

## File Structure

```
app/                    # Next.js App Router pages
  [route]/page.tsx      # Route pages
  layout.tsx            # Root layout
  globals.css           # Global styles
components/             # Reusable UI components
  [component].tsx
lib/                    # Utilities and configurations
  validations/          # Zod schemas + TypeScript types
    [domain].ts
```

---

## Form Rules

**This is a hard requirement — no exceptions.**

- Forms use **react-hook-form + zod**, never uncontrolled inputs, never manual `useState` for form state
- Every form input must have:
  - `<label htmlFor="field-id">` linked to input
  - `aria-describedby` pointing to error message element
  - `aria-invalid={errors.field ? "true" : "false"}`
- Validation schemas live in `lib/validations/` with types inferred via `z.infer<typeof schema>`
- Error messages use `role="alert"` inline, **never** `alert()` dialogs
- Success feedback uses `aria-live="polite"` regions, not blocking alerts
- Forms must include `noValidate` attribute to let zod handle validation
- Loading states must disable submit button and show "Saving..." text

---

## Accessibility Rules

**Every component must pass these checks before commit:**

- All images have meaningful `alt` text (empty `alt=""` only for decorative)
- All interactive elements are keyboard navigable
- Focus indicators are visible (never `outline: none` without replacement)
- Color contrast ratio meets WCAG AA (4.5:1 for text, 3:1 for large text)
- Form errors are announced to screen readers via `role="alert"`
- Dynamic content updates use `aria-live` regions
- Modals/dialogs trap focus and return focus on close
- Test with keyboard only — Tab, Enter, Escape, Arrow keys

---

## Git Conventions

- Format: `type(scope): description`
- Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`
- Keep commits **atomic and focused** — one logical change per commit
- Never commit secrets, API keys, or `.env` files
- Branch naming: `feature/[name]`, `fix/[name]`, `docs/[name]`

---

## Design Principles

When building UI, follow these principles from the frontend-design skill:

### Ground It in the Subject
- Name the concrete subject, audience, and page's single job before designing
- Use the subject's own world — materials, artifacts, vernacular — for distinctive choices
- Build with real content, not placeholder text

### Typography
- Pair display and body faces **deliberately** — not default system fonts
- Set a clear type scale with intentional weights and spacing
- Typography carries personality — make it memorable

### Motion
- Animation must serve the subject — page-load sequences, scroll reveals, hover micro-interactions
- Orchestrate one moment well rather than scattering effects
- Less is more — extra animation feels AI-generated

### Anti-Patterns to Avoid
- Warm cream background + high-contrast serif + terracotta accent (AI default #1)
- Near-black background + single acid-green/vermilion accent (AI default #2)
- Broadsheet newspaper layout with hairline rules and zero border-radius (AI default #3)
- Big number + small label + gradient accent hero (template answer)
- Numbered markers (01/02/03) unless content is genuinely sequential

### Self-Critique Before Shipping
- Spend boldness in **one place** — keep everything else disciplined
- Apply Chanel principle: remove one accessory before shipping
- Responsive down to mobile, visible keyboard focus, reduced motion respected

---

## Writing Rules

- Words are **design material**, not decoration
- Write from the **end user's perspective** — name things by what people control
- Use **active voice** as default: "Save changes" not "Submit"
- Action vocabulary stays consistent through flows: "Publish" → "Published"
- Treat failure and emptiness as **direction, not mood**
- Keep register conversational: plain verbs, sentence case, no filler

---

## Verification Loop

Before every commit, run:

```bash
npx eslint        # Lint check
npx next build    # Build check
```

If either fails, fix before committing. No exceptions.

---

## AI Assistance Guidelines

- Always explain the reasoning behind code changes
- Suggest accessibility improvements when relevant
- Follow existing patterns in the codebase
- Ask for clarification when requirements are ambiguous
- When writing code, check neighboring files for conventions before inventing new ones
- Never assume a library is available — check `package.json` first
