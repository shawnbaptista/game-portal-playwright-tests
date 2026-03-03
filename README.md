<p align="center">
  
  <!-- Husky -->
  <img src="https://img.shields.io/badge/git%20hook%20manager-husky-2A6DB2?style=for-the-badge&logo=husky&logoColor=white" alt="Husky">
  
  <!-- Prettier -->
  <img src="https://img.shields.io/badge/code%20style-prettier-000000?style=for-the-badge&logo=prettier&logoColor=white" alt="Prettier">

  <!-- ESLint -->
  <img src="https://img.shields.io/badge/linting-ESLint-FCC21B?style=for-the-badge&logo=eslint&logoColor=white" alt="ESLint">

  <!-- Playwright -->
  <img src="https://img.shields.io/badge/tests-playwright-0A9EDC?style=for-the-badge&logo=playwright&logoColor=white" alt="Playwright">

</p>

# game-portal-playwright-tests

## UI Testing for "Games for Brains" Website

A Playwright test suite covering various games on the "Games for Brains" website, starting with Checkers.

## Table of Contents

- [Test Strategy](#test-strategy)
- [Defects Found](#defects-found)
- [Testability Recommendations](#testability-recommendations)
- [Project Structure](#project-structure)
- [Source Structure and Design](#source-structure-and-design)
- [Getting Started](#getting-started)
- [Running Tests](#running-tests)
- [Quality Guardrails and CI](#quality-guardrails-and-ci)

---

### Test Strategy

Tests cover Checkers across five areas: board rules, gameplay mechanics
(legal and invalid moves, end states), navigation, UI indicators, and messaging.
See `docs/test-plan.md` for the full test plan including invariants and defect log.

---

### Defects Found

8 defects identified and documented with priority and severity ratings.
See `docs/test-plan.md` for the full defect log.

---

### Testability Recommendations

Suggestions for `data-*` attributes and state injection to improve test reliability
and reduce selector brittleness. See `docs/test-plan.md`.

---

### Project Structure

```
docs/ -- markdown files containing notes on testing the website, test plan, and potential defects
src/
    app/  -- pages, components, and tests for the games website, not for specific games themselves
    games/ -- games and their associated pages, components, and tests
```

See `docs/` for the test plan, defect log, and testing notes.

---

### Source Structure and Design

#### Page Object Models and Tests

Tests are organized by domain — `app/` for the site itself, `games/` for individual games — mirroring the structure of the application under test.

```
src/
├── app/                        -- site-level pages and tests
│   ├── HomePage.ts
│   └── tests/
│       └── home-page.spec.ts
└── games/                      -- game-level pages and tests
    ├── GamePage.ts
    └── checkers/
        ├── CheckersPage.ts
        └── tests/
            ├── checkers-gameplay.spec.ts
            └── checkers-navigation.spec.ts
```

Page Object Models (POMs) are colocated with their domain rather than in a separate `pages/` folder, keeping the model and its tests together as a unit. `GamePage.ts` serves as a base for all games, with game-specific pages like `CheckersPage.ts` extending it for game-specific interactions.

`CheckersPage.ts` contains two classes: `CheckersPage` for page-level interactions
(navigation, messaging, UI indicators) and `CheckersBoard` for board-level interactions
(piece selection, move mechanics, board state). Separating these concerns keeps each
class focused and makes tests easier to read and maintain.

Tests are split by concern — `checkers-gameplay.spec.ts` covers board rules and move mechanics, while `checkers-navigation.spec.ts` covers navigation and UI — keeping test files focused and failures easy to locate.

---

### Getting Started

```bash
# Install dependencies
yarn install
```

See `docs/developer-notes.md` for full setup details including VSCode configuration and Husky hook setup.

---

### Running Tests

| Script                               | Description          |
| :----------------------------------- | :------------------- |
| `yarn test`                          | Run all tests        |
| `yarn test --grep @smoke`            | Run smoke tests only |

---

### Quality Guardrails and CI

#### Tools

- [prettier](https://prettier.io/docs/install) for code formatting
- [husky](https://typicode.github.io/husky/how-to.html) as git hook manager
  - pre-commit
  - pre-push
- [eslint](https://eslint.org/docs/latest/use/core-concepts/) as linter

#### Flow

1. pre-commit
   - husky pre-commit hook -- `.husky/pre-commit`
     - formatter runs
     - linter runs
2. pre-push
   - husky pre-push hook -- `.husky/pre-push`
     - typecheck runs
3. push (safety net - catches anything bypassed locally; jobs ordered from highest criticality to least for fast failures)
   - GitHub Workflow - Quality Gates -- `.github/workflows/quality-gates.yml`
     - typechecker runs
     - linter runs
     - formatter runs
4. pull request to `main`
   - GitHub Workflow - Playwright -- `.github/workflows/playwright.yml`
     - playwright tests run
     - test report uploaded as a downloadable artifact, retained for 30 days (accessible via the GitHub Actions run summary)

---
