# game-portal-playwright-tests

## UI Testing for "Games for Brains" Website

Proof-of-Concept for testing various games on the "Games for Brains" website, starting with Checkers.

### Project Structure

```
src/
    app/  -- pages, components, and tests for the games website, not for specific games themselves
    games/ -- games and their associated pages, components, and tests
```

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

### Scratch Notes

There are multiple games on the website: gamesforthebrain.com -- soooo that means the repo could be for testing the website, and therefore any of the games

Board: class="boardWrapper"

User King: src="you1k.gif"
User: src="you1.gif"
Enemy King: src="me1k.gif"
Enemy: src="me1.gif"
Empty Square: src="https://www.gamesforthebrain.com/game/checkers/gray.gif"
Invalid Square / Black: src="black.gif"
Selected User piece: "you2.gif"

DEFECT: Based on the Checkers rules page on Wikipedia, the pieces start on the black squares, yet the game starts on the white squares: https://en.wikipedia.org/wiki/Checkers
DEFECT: "Rules" link goes to invalid page, redirects to a link that doesn't exist anymore -- also, shouldn't the link open in another tab instead of directing AWAY from the game page? The user would not know how to get to the game intuitively, other than clicking the back button -- also, what if they are checking the rules mid-game, they'll lose their progress (Ah! They do not lose their progress... maybe local storage?)

- Found that the game is loaded via `game/checkers/default.js` -- found in Dev Tools `Source` -> `Page`
  _ Source code says "red" is the player, yet the UI shows "orange" -- also in the messages
  _ Source code says "black" is the computer, yet the UI shows "black" as the actual black squares that cannot be touched/landed on
  _ With the images (.gif files), they are labelled as "you_", "me\*", or "black.gif" -- set the variables in the test repo as "player" vs. "computer" especially when the source code commented vars say:
  - var black = -1; // computer is black
    _ var red = 1; // visitor is red
    _ Global variables used in the `default.js` game logic -- risk as they can be overridden  
    DEFECT?: Clicking while opponent is moving raises "Please wait" message
    DEFECT: Locked -- "In almost all variants, a player with no valid move remaining loses. This occurs if the player has no pieces left, or if all the player's pieces are obstructed from moving by opponent pieces" -- game SHOULD end here, but does not

￼
Invariants
Movement:

- Pieces can move diagonally to a blank square
- Pieces can never move to black squares ("Move diagonally only" appears)
- Pieces can never move backwards
- Moving a piece to the oppose side of the board results in the piece becoming a "king" piece
  Capture:
- Pieces can move two spaces if an enemy piece is in between, and only if that space is clicked, not if the enemy piece is clicked
- "Complete the double jump or click on your piece to stay still." -- when capturing a single piece, but can do double-capture
  When your turn: Clicking an opponent's piece does nothing; clicking your own piece highlights it
- Restart button refreshes the board

Messages:

- Start: "Select an orange piece to move."
- "Make a move."
- "Please wait."
- "You win" ??
- "You lose. Game over."
- "Move diagonally only." -- after clicking your piece and clicking on an empty space in the same row
  Game Ends:
- Win if all enemy pieces are removed from board
- Lose if all user pieces are removed from board

Each valid square has an "onclick" attribute; e.g. onclick="didclick(2, 4)"

#### Playwright observations:

- Assertion toHaveURL can use regular expressions; e.g., `await expect(page).toHaveURL(/docs?\//);`: https://playwright.dev/docs/api/class-pageassertions#page-assertions-to-have-url

- Assertion toStrictEqual does not seem to behave well with objects (specfically the Coordinates class instantiated), this appears to be the solution based on documentation -- "subset of object properties": https://playwright.dev/docs/api/class-genericassertions#generic-assertions-to-match-object
