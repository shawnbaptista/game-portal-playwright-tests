import { expect, test } from "@playwright/test";
import { CheckersPage } from "../CheckersPage";

test.describe("Checkers landing page functionality", () => {
  let checkersPage: CheckersPage;

  test.beforeEach(async ({ page }) => {
    checkersPage = new CheckersPage(page);
    await checkersPage.goto();
  });

  test(
    "User can navigate to the Checkers game",
    { tag: "@smoke" },
    async ({ page }) => {
      await expect(page).toHaveURL(/\/game\/checkers\/$/);
      await expect(page).toHaveTitle(/Checkers/);
      await expect(checkersPage.gameName).toHaveText("Checkers");
    },
  );

  test("User can restart a game", async ({ page }) => {
    // GIVEN: A new game has started
    const originalState = await checkersPage.board.getBoardState();

    // WHEN: A piece is moved
    await checkersPage.board.makeLegalMove(originalState);
    await checkersPage.board.waitForComputerMove();

    //  AND: The user clicks on the restart link
    await expect(checkersPage.restartLink).toBeVisible();
    await checkersPage.clickOnRestartLink();
    await page.reload();

    // THEN: The board is reset to a new game
    const newState = await checkersPage.board.getBoardState();
    expect(newState).toMatchObject(originalState);
  });

  test("User can view the rules", { tag: "@smoke" }, async ({ page }) => {
    await expect(checkersPage.rulesLink).toBeVisible();
    await checkersPage.clickOnRulesLink();

    await expect(page).toHaveURL(/wikipedia\.org\/wiki\/Checkers/);
  });

  /**
   * Different results from using a real browser vs. the playwright test runner -- appears to be back-forward cache related
   *  (https://web.dev/articles/bfcache?utm_source=devtools&utm_campaign=stable)
   *    (Can also be tested via DevTools -> Application -> Background services: Back/forward cache)
   *    (Hard refresh ALSO resets state)
   */
  test.skip(
    "User does not lose progress after viewing the rules and clicking the back button",
    { tag: "@discussion" },
    async ({ page }) => {
      // GIVEN: User has moved a piece
      const originState = await checkersPage.board.getBoardState();
      await checkersPage.board.makeLegalMove(originState);
      await checkersPage.board.waitForComputerMove();
      const afterMovesBoardState = await checkersPage.board.getBoardState();

      // WHEN: The user has navigated to the Rules page
      await checkersPage.clickOnRulesLink();
      //   AND: The user has clicked the back button
      await page.goBack();
      // await page.reload()

      // THEN: The game should not have changed state
      const afterBackButtonClickedBoardState =
        await checkersPage.board.getBoardState();
      expect(afterBackButtonClickedBoardState).toMatchObject(
        afterMovesBoardState,
      );
    },
  );

  test("User can see other games", async () => {
    const count = await checkersPage.navigationLinks.count();
    expect(count).toBeGreaterThan(10);
    const counterfeitGameLink = checkersPage.navigationLinks.getByRole("link", {
      name: "Counterfeit",
    });

    await expect(counterfeitGameLink).toBeVisible();
  });
});
