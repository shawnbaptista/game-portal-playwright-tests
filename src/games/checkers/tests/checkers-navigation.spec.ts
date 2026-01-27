import { expect, test } from "@playwright/test";
import { CheckersPage } from "../CheckersPage";

test.describe("Checkers landing page functionality", () => {
  let checkersPage;

  test.beforeEach(async ({ page }) => {
    checkersPage = new CheckersPage(page);
    await checkersPage.goto();
  });

  test("User can navigate to the Checkers game", async ({ page }) => {
    await expect(page).toHaveURL(/\/game\/checkers\/$/);
  });

  test("User can restart a game", () => {});

  test("User can view the rules", () => {});
});
