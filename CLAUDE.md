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
npm run build:tokens  # regenerate src/styles/tokens.css from tokens/tokens.json
npm run lint       # run ESLint
npm run test       # run tests once
npm run check      # lint + build + test (run before committing)
```

## Rules

- Always work on a new branch named `feature/<short-name>` or `fix/<short-name>`. Never commit to `main`.
- A Husky pre-commit hook (`.husky/pre-commit`, installed automatically by `npm install`) blocks commits made directly on `main`. Create a branch first.
- Run `npm run check` before committing, not after every change. Don't open a PR if it fails.
- Open PRs with `gh`, including a summary of changes, how to test, and "Closes #N" if there's a related issue.
- Keep all localStorage access in a single storage module.
- Never commit secrets; use environment variables.
- Keep `languageOptions.ecmaVersion` in `eslint.config.js` in sync with `target` in `tsconfig.app.json` and `tsconfig.node.json`.

## Folder structure

```
src/
  components/   # shared UI (button, modal, show-card)
  hooks/        # shared hooks (use-shows)
  utils/        # pure helpers
  services/     # API calls, storage.ts (the single localStorage module)
  types/        # shared TS types
  pages/        # route-level screens, if routing is added
  styles/       # global CSS, including the generated tokens.css
  test/         # test setup and shared test helpers/mocks
  app.tsx
  main.tsx
e2e/            # end-to-end tests (future, not yet set up)
scripts/        # dev/build scripts run with Node or the shell, not bundled into the app
tokens/         # design tokens exported from Figma (tokens.json), gitignored
```

- Unit tests sit next to the file they test, named `<file>.test.tsx` (e.g. `show-card.tsx` → `show-card.test.tsx`).
- E2E tests go in the top-level `e2e/` folder, named `<name>.spec.ts`. Vitest only runs `src/**/*.test.{ts,tsx}`.
- Scripts in `scripts/` use kebab-case names and start with a comment saying what they do and how to run them. Scripts run regularly get an `npm run` entry.
- If the app grows, move to feature folders (`src/features/<feature>/`) holding that feature's components, hooks, and tests; keep only cross-feature code in the top-level folders.

## Design tokens

- Figma variables are the source of truth. Export them to `tokens/tokens.json` (gitignored, local only), run `npm run build:tokens`, and commit the generated `src/styles/tokens.css`. Never edit `tokens.css` by hand.
- Collections are `primitive/<mode>` and `semantic/<mode>` (currently only `light`). Primitives are `color/<hue>/<step>` (50–950, lightest to darkest). Semantic tokens are `<component>/<variant>/<property>[/<state>]` (e.g. `badge/ongoing/bg`), or `page/<property>` for page-level colors. Names are lowercase kebab-case.
- Tailwind's default palette is disabled, so only semantic tokens exist as color utilities (e.g. `bg-page-bg`). Primitives are CSS variables only; don't use them in components. Add missing colors in Figma, not in CSS.

## Coding conventions

- Avoid duplication of code by moving shared logic into hooks or utils and shared UI code into components.
- Avoid side effects if possible and if not, point them out.
- Components, hooks, and functions should have adequate JSDoc.
- Prefer named exports for shared modules.
- Use ES6 declarations: `const`/`let` and arrow functions (`const name = () => {}`), not `var` or `function` declarations.
- Type all React components as `FC` (e.g. `export const Badge: FC<BadgeProps> = ({ type }) => ...`).
- Prefer descriptive variable names over abbreviations.
- Use kebab-case for file names, class names, and element IDs. camelCase for variables and functions. PascalCase for components, types, enums, interfaces, and classes.
- Do not leave dead code.

## UI and Design Rules

- Components must be responsive (keep in mind mobile, tablet, and desktop).
- Most designs will be the same for tablet and desktop.
- Meet and point out any accessibility concerns.
