# TODO.md — Portfolio Next-Case Reminder

A tracked, version-controlled reminder so the portfolio keeps growing. This
shows up every time the repo is opened — that is the nudge.

## Reminder

- **What:** Add the next case study to the portfolio.
- **Check cadence:** Every time a new build ships (or at least once a month).
- **How:** Follow `NEXT-CASE.md` — three-beat shape, precise prompt, verify,
  commit. Roughly a 30–60 minute conversation, not a rebuild.

## Next named piece (in progress)

**Case study #2 — "GitHub Repo Finder"** (a new small app build)

- **Type:** New small app / feature build.
- **What it is:** A small Next.js search app that queries the public GitHub API
  by repo name, with a search form, loading / empty / error states, and
  accessibility (WCAG AA).
- **Why this one:** It reuses everything already proven in this project —
  Next.js App Router, react-hook-form + zod form rules, `role="alert"` errors,
  `aria-live` feedback — in a second, independent build. It gives the next
  three-beat case study a real, portable subject.
- **Template to reuse (three beats):**
  1. Problem — a dev wants to find a repo but the search UX is noisy.
  2. What you did — built a focused search form with real validation and clear
     loading/empty/error states on the GitHub API.
  3. What came of it — a working mini-app whose form beats the "feels right"
     default AI output (include the diff + lint/build pass).
- **Repo location:** branch off `main`, case doc in `docs/case-studies/github-repo-finder.md`.

**Do this one before starting a third piece.**

## Backlog

- (placeholder for future ideas — add the next one here as you go)
