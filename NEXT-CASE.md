# NEXT-CASE.md — How to Add the Next Case Study

This is the runbook for adding the next portfolio case study. It exists so the
portfolio never goes stale and the next case is a short conversation, not a
rebuild. Keep this file next to the build context so future updates stay cheap.

---

## Where the next case goes

Create a new branch, then add one doc in `docs/case-studies/`:

```
docs/case-studies/NAME-OF-CASE.md
```

If that folder doesn't exist yet, create it:

```bash
mkdir -p docs/case-studies
```

Optionally link it from `README.md` under a "Case Studies" section so it's
discoverable from the landing page.

---

## The three-beat shape (Week 2 template)

Every case follows the same short arc. Do not grow it — three beats only.

1. **Problem** — The concrete situation and why it mattered. Name the subject
   and the audience. One or two sentences.
2. **What you did** — The decision and the build. Show the meaningful choices,
   not a feature list. Include the code/link and the stack.
3. **What came of it** — The outcome you can point at. A diff, a before/after,
   a metric, a review result, a lesson. Something provable.

If your case is a build (like this capstone's), the most honest "came of it"
is often the code diff and the verification that passed. That is enough.

---

## Steps to add one

1. **Name it.** Open `TODO.md`, pick the next piece, and note it at the top of
   this file's "Next up" section.
2. **Branch off `main`:** `git checkout -b feat/base-branch-name`.
3. **Write the three beats first.** Draft Problem / What you did / What came of
   it in plain sentences before writing code. This is the spec.
4. **Build it with precise prompts.** Feed the draft beats plus the file layout
   to the AI. Reference existing patterns in `AGENTS.md` and `CLAUDE.md` so the
   output matches the codebase instead of reinventing it.
5. **Verify before committing.** Run `npx eslint` and `npx next build`. Fix
   anything that fails.
6. **Fill in the case doc.** Turn the three beats into `docs/case-studies/NAME.md`
   and link it from `README.md`.
7. **Commit atomically.** One logical change per commit, Conventional Commits
   format (`type(scope): description`).
8. **Update `TODO.md`.** Mark the piece as done and name the next one, so the
   loop keeps turning.

---

## Next up

- **Next named piece:** GitHub Repo Finder — a small search app (see `TODO.md`).
- **Reminder:** tracked in `TODO.md` (version controlled, shows up every time
   you open the repo).

---

## Why the build context stays preserved

- `CLAUDE.md` and `AGENTS.md` hold the stack, voice, and rules. Point the AI at
  these and the next case reuses the identity kit without a rebuild.
- This file and `TODO.md` are committed, so the know-how survives and ships
  with the repo.
