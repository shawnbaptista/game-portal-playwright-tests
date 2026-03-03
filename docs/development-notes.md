# Developer Notes

## Setup

### 1. Install Playwright

```bash
yarn create playwright
```

See [official docs](https://playwright.dev/docs/intro#installing-playwright) for details.

### 2. Configure Playwright

In `playwright.config.ts`, set `testDir` to `./src` so Playwright can discover tests:

```ts
defineConfig({
  testDir: './src',
  ...
})
```

### 3. Fix VSCode Playwright Import Recognition

Follow the [Yarn editor SDK setup](https://yarnpkg.com/getting-started/editor-sdks) to resolve unrecognized imports in VSCode.

### 4. Install the Playwright VSCode Extension

Install `Playwright Test for VSCode` as per the [official docs](https://playwright.dev/docs/running-tests#run-tests-in-vs-code).

### 5. Verify Husky Hook Path

Ensure `.husky` is set as the `core.hooksPath`:

```bash
git config core.hooksPath
```

If not set, run:

```bash
git config core.hooksPath .husky
```

---

## Scripts

The following scripts are available in `package.json`:

| Script | Description |
| :----- | :---------- |
| `yarn prepare` | Sets up Husky |
| `yarn run format` | Check formatting with Prettier |
| `yarn run format:write` | Auto-fix formatting with Prettier |
| `yarn run lint` | Run ESLint |
| `yarn run tsc --noEmit` | Run TypeScript type checker (no file output) |
| `yarn playwright test --grep @smoke` | Run smoke tests |

---

## Tool Configuration Notes

### Prettier
- Configured for code formatting on pre-commit
- See [install docs](https://prettier.io/docs/install)

### Husky
- Manages pre-commit and pre-push hooks via `.husky/`
- See [how-to docs](https://typicode.github.io/husky/how-to.html)

### ESLint
- Uses `@eslint/js` with recommended rules
- Config in `eslint.config.js`
- `.yarn` and other non-source files are excluded from linting
- Uses `typescript-eslint` for `.ts` file support
- See [configuration docs](https://eslint.org/docs/latest/use/configure/)

### TypeScript
- `tsconfig.json` enables type checking via the TypeScript Compiler
- `--noEmit` flag prevents JS file creation on typecheck runs
- See [tsconfig docs](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html)

### GitHub Actions
- `.github/workflows/playwright.yml` uses Yarn via [Corepack](https://github.com/nodejs/corepack) to avoid a separate Yarn install step

### Shields / Badges
- Badges generated via [shields.io](https://shields.io/) using [Simple Icons](https://shields.io/docs/logos#simpleicons)

---

## Playwright Notes

- `toHaveURL` supports regular expressions:
  ```ts
  await expect(page).toHaveURL(/docs?\//);
  ```
  See [docs](https://playwright.dev/docs/api/class-pageassertions#page-assertions-to-have-url)

- For object comparisons, prefer `toMatchObject` over `toStrictEqual` when matching a subset of object properties:
  ```ts
  expect(result).toMatchObject({ x: 0, y: 2 });
  ```
  See [docs](https://playwright.dev/docs/api/class-genericassertions#generic-assertions-to-match-object)

- Tagging and running tagged tests:
  ```bash
  yarn playwright test --grep @smoke
  ```
  See [test annotations docs](https://playwright.dev/docs/test-annotations#tag-tests)