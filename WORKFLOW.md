# WORKFLOW.md — AI Workflow Comparison: Settings Form

## Feature: Settings form with validation

Two branches built the same feature using different prompting strategies. The goal was to make the difference in AI-directed development visible through concrete code diffs.

---

## Round 1: Vague Prompt

**Prompt:** "Make a settings page with a form"

**Result:** A single `app/settings/page.tsx` file with:
- Inline `style` attributes instead of Tailwind classes
- No form library — manual `useState` for each field
- No validation whatsoever (empty name/email accepted silently)
- No error states or feedback beyond `alert()`
- No semantic HTML (missing `<label htmlFor>`, no ARIA attributes)
- No accessibility: no `aria-describedby`, no `role="alert"` on errors, no focus management
- Hardcoded theme options (no "system" option)
- No responsive design consideration
- No TypeScript types

**Lines of code:** ~65

---

## Round 2: Precise Prompt

**Prompt:** Detailed spec with file references, library choices (react-hook-form + zod), field definitions, validation rules, accessibility requirements, responsive design, and verification step (`pnpm lint && pnpm build`).

**Result:** Four files with clear separation of concerns:

| File | Purpose |
|---|---|
| `lib/validations/settings.ts` | Zod schema + inferred TypeScript type |
| `components/settings-form.tsx` | Reusable form component with react-hook-form |
| `app/settings/page.tsx` | Page wrapper with success toast |

**Key differences from Round 1:**
- **Validation:** Zod schema with min/max length, email format, enum validation
- **Error messages:** Inline `role="alert"` error messages with `aria-describedby`
- **Accessibility:** Every input has `<label htmlFor>`, `aria-invalid`, `aria-describedby` linking to error, keyboard-navigable
- **TypeScript:** Full type inference from Zod schema via `z.infer`
- **Responsive:** Tailwind responsive classes (`sm:px-6`, `max-w-2xl`, mobile-first)
- **Dark mode:** Full dark mode support via Tailwind `dark:` variants
- **Feedback:** `aria-live="polite"` success toast instead of `alert()`
- **Loading state:** Disabled button + "Saving..." text during submission
- **Component extracted:** Form is a reusable `<SettingsForm>` component with props

**Lines of code:** ~188 (across 4 files)

---

## Specific Diffs That Matter

1. **Validation:** Round 1 has zero validation. Round 2 has 5 validation rules (name required, name min 2 chars, name max 50, email format, theme enum). Submitting an empty form in Round 1 silently saves; in Round 2 it shows three error messages.

2. **Accessibility:** Round 1 has no `<label htmlFor>`, no ARIA attributes, no error announcements. Round 2 has `aria-describedby`, `aria-invalid`, `role="alert"` on errors, `aria-live="polite"` on success. Screen reader users get zero feedback in Round 1.

3. **Error UX:** Round 1 uses `alert()` (blocking, non-accessible). Round 2 uses inline error messages with `role="alert"` (non-blocking, accessible).

4. **Type safety:** Round 1 has no types — any string is accepted for name/email, any value for theme. Round 2 has `SettingsFormData` type inferred from Zod, so TypeScript catches invalid data at compile time.

5. **Component reuse:** Round 1 is a monolithic page. Round 2 extracts `<SettingsForm>` as a reusable component accepting `initialData` and `onSubmit` props.

---

## Time Comparison

| | Round 1 (Vague) | Round 2 (Precise) |
|---|---|---|
| Prompt writing | ~10 seconds | ~5 minutes |
| AI generation | ~30 seconds | ~2 minutes |
| Review + fixes needed | 0 (accepted as-is) | Minimal (lint + build passed first try) |
| Total time | ~1 minute | ~8 minutes |

Round 2 took longer upfront but required **zero review fixes** — lint and build passed immediately. Round 1 was fast but produced code that would need significant rework for production (add validation, accessibility, types, error handling).

---

## AI Mistakes Caught

1. **Round 1 — No validation at all:** The vague prompt produced a form that accepts any input. An empty name and "not-an-email" both pass silently. This is the most common AI failure mode: it solves the visible structure but misses invisible requirements.

2. **Round 1 — `alert()` for success feedback:** Blocking browser alerts are poor UX and inaccessible. The AI defaulted to the simplest possible feedback mechanism without considering alternatives.

3. **Round 2 — `@hookform/resolvers/zod` import path:** Initially the import was `@hookform/resolvers/zod` which failed because the package wasn't installed. The precise prompt's verification step (`pnpm lint && pnpm build`) caught this immediately. Without it, the error would have surfaced later.

---

## Rules Added to CLAUDE.md

Three concrete, testable rules were added based on what this drill revealed:

1. **Forms use react-hook-form + zod** — never uncontrolled inputs, never manual useState for form state
2. **Every form input must have** `<label htmlFor>`, `aria-describedby` for errors, and `aria-invalid`
3. **Validation schemas live in `lib/validations/`** — co-located with TypeScript types inferred via `z.infer`

---

## Verdict

The vague prompt produces scaffolding that looks right but doesn't work right. The precise prompt produces production-ready code in one pass. The real cost difference isn't generation time — it's **review and fix time** that the vague approach pushes downstream.
