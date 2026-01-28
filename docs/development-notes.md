### Developers notes on setting up the repository from scratch

1. Installed Playwright (https://playwright.dev/docs/intro#installing-playwright)

```
yarn create playwright
```

2. Modified `playwright.config.ts::defineConfig`

- Tests are to be placed in `./src`, otherwise playwright cannot discover them for running, as set via the `testDir` property.

3. VSCode did not recognize playwright imports, fix as per yarnpkg.com recommendation (https://yarnpkg.com/getting-started/editor-sdks)

- https://yarnpkg.com/getting-started/editor-sdks

4. Install `Playwright Test for VSCode` as per official docs (https://playwright.dev/docs/running-tests#run-tests-in-vs-code)

5. Tagging and running tagged tests (https://playwright.dev/docs/test-annotations#tag-tests)

- e.g., '@smoke'; run via `yarn playwright test --grep @smoke`

6. Add quality guardrails:

- prettier for code formatting: https://prettier.io/docs/install
  - `yarn exec prettier . --write` -- format all files (add this to pre-commit... should add this as a script (DONE!))
    - `yarn run format` -- script added to `package.json`
    - `yarn run format:write` -- script added to `package.json`
- husky as git hook manager: https://typicode.github.io/husky/how-to.html
  - `yarn prepare` -- script added to `package.json` for setting up husky
  - updated `.husky/_/pre-commit` to run scripts found in `package.json` automatically on commit
- eslint as linter: https://eslint.org/docs/latest/use/core-concepts/
  - added `@eslint/js` as recommended by eslint (https://eslint.org/docs/latest/rules/)
  - added `eslint.config.js` as per configuration steps (https://eslint.org/docs/latest/use/configure/)
    - `.yarn` files and others that shouldn't be linted were being checked -- added them to an ignore list
    - linter blew up on .ts files, adding in `typescript-eslint` as fix
  - added `typescript typescript-eslint` as per (https://typescript-eslint.io/getting-started)
  - updated `.husky/_/pre-commit` to include the `package.json` script for linting
- updated the automatically created `.github/workflows/playwright.yml` file to use yarn and corepack (prevents having to install yarn) (https://github.com/nodejs/corepack)
- set up the husky `pre-push` to run the playwright tests tagged as '@smoke'

7. Add badges to the repository's readme using shields.io and simpleicons (https://shields.io/docs/logos#simpleicons)

#### Playwright observations:

- Assertion toHaveURL can use regular expressions; e.g., `await expect(page).toHaveURL(/docs?\//);`: https://playwright.dev/docs/api/class-pageassertions#page-assertions-to-have-url

- Assertion toStrictEqual does not seem to behave well with objects (specfically the Coordinates class instantiated), this appears to be the solution based on documentation -- "subset of object properties": https://playwright.dev/docs/api/class-genericassertions#generic-assertions-to-match-object
