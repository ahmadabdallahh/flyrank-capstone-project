# ADD_NEXT_CASE.md — How to Add the Next Case Study

The AI Smart Code & Resume Reviewer is the first real, deployed portfolio case.
A portfolio that never earns a second project goes stale. This guide makes the
next case a short conversation, not a rebuild.

---

## Where the next case goes

Each case study becomes one markdown doc in this repo:

```
docs/case-studies/NAME-OF-CASE.md
```

Link the new case from the README so it stays discoverable.

## The three-beat shape (always)

Every case study follows the same arc. Do not expand it — three beats only.

1. **Problem** — the concrete situation and who it mattered to.
2. **What you did** — the decision and the build (stack, meaningful choices).
3. **What came of it** — a provable outcome: a diff, scores, a review, a lesson.

The current case (this repo) as an example:

- **Problem:** Junior devs and students don't know why their resumes/code get
  rejected, and generic tools give vague, non-actionable feedback.
- **What I did:** Built an accessible Next.js app that parses resume PDFs
  client-side, accepts GitHub links or code snippets, and hits an LLM with a
  strict Zod schema to return structured, actionable review data — resilient
  with fallbacks, tested, and deployed.
- **What came of it:** 90%+ test coverage, lint-clean build, accessible +
  responsive flow, deployed live. Vague "AI echo" became a structured,
  copy-paste-ready review.

## Steps to add the next one

1. **Name it.** Pick a real project you actually want to build next.
2. **Branch off `main`** — keep each case reviewable and isolated.
3. **Draft the three beats first** (plain sentences, that's the spec).
4. **Build with precise prompts.** Point the AI at `CLAUDE.md` + `AGENTS.md` so
   the output reuses this repo's stack, voice, and rules instead of inventing
   new ones.
5. **Verify before commit:** `bun run lint`, `bun run build`, `bun run test`.
6. **Write the case doc** in `docs/case-studies/`.
7. **Deploy** (Vercel) with the same checklist workflow used here.
8. **Update this file's "Next up" section.**

## Next up — reminder

- **Named next piece:** A small, self-contained component or tool that solves a
  real developer problem and can ship in a week. Candidate (add yours):
  - A "Pareto reporter" — analyze any text (e.g. a repo README or a PR
    description) and return the top 3 highest-impact fixes. Reuses the same
    LLM + Zod pipeline, new UI, new type of input.
- **Reminder:** add a recurring calendar event or a note in your task manager:
  - **Title:** "Add the next portfolio case study"
  - **Every:** 1st of each month (or every time you finish a small shipped
    project)
  - **Body:** "Open ADD_NEXT_CASE.md, pick the named next piece, follow the
    steps. Portfolio case ≥ 3-beat shape."
- Calendar URL for a monthly reminder (1st of each month, 09:00) — open this
  to add it directly to Google Calendar:

```
https://calendar.google.com/calendar/render?
  action=TEMPLATE
  &text=Add%20the%20next%20portfolio%20case%20study
  &dates=20260901T090000/20260901T100000
  &recur=RRULE:FREQ=MONTHLY;BYMONTHDAY=1
  &details=Open%20ADD_NEXT_CASE.md%2C%20pick%20the%20named%20next%20piece%2C%20follow%20the%20steps.
```

## Why the build context is preserved

`CLAUDE.md` and `AGENTS.md` hold this repo's stack, voice, and accessibility
rules. The `lib/` pipeline (Zod schemas, AI server action, PDF parser) is
reusable. The next case reuses the plumbing and only adds a new UI + input
type — a short conversation, not a rebuild.