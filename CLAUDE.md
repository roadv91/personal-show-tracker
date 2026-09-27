# Personal Show Tracker

Personal Show Tracker: a personal project to improve my own skills.

## Stack

- **React 19** + **TypeScript** — UI
- **Vite 8** — build tool and dev server
- **Tailwind CSS v4** via `@tailwindcss/vite` — styling (no config file needed)
- **ESLint** — linting
- **Vitest** + **React Testing Library** — unit tests

## Commands

```bash
npm install        # install dependencies
npm run dev        # start dev server
npm run build      # type-check + build for production
npm run lint       # run ESLint
npm run test       # run tests once
```

## Rules

- Always work on a new branch named `feature/<short-name>` or `fix/<short-name>`. Never commit to `main`.
- Run lint and tests before committing. Don't open a PR if they fail.
- Open PRs with `gh`, including a summary of changes, how to test, and "Closes #N" if there's a related issue.
- Keep all localStorage access in a single storage module.
- Never commit secrets; use environment variables.
