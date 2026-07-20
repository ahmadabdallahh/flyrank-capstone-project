# Project Conventions for Claude Code

## Stack

- Front-end focused project (HTML, CSS, JavaScript)
- Modern ES6+ JavaScript
- Responsive design principles

## Code Style

- Use semantic HTML elements
- Follow BEM methodology for CSS class naming
- Use `const` and `let` instead of `var`
- Prefer arrow functions for anonymous functions
- Use template literals for string interpolation

## Git Conventions

- Follow Conventional Commits format: `type(scope): description`
- Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`
- Keep commits atomic and focused

## Form Rules (FE-11)

- Forms use react-hook-form + zod, never uncontrolled inputs, never manual useState for form state
- Every form input must have `<label htmlFor>`, `aria-describedby` for errors, and `aria-invalid`
- Validation schemas live in `lib/validations/` with TypeScript types inferred via `z.infer`
- Error messages use `role="alert"` inline, never `alert()` dialogs
- Success feedback uses `aria-live="polite"` regions, not blocking alerts

## AI Assistance Guidelines

- Always explain the reasoning behind code changes
- Suggest accessibility improvements when relevant
- Follow existing patterns in the codebase
- Ask for clarification when requirements are ambiguous
