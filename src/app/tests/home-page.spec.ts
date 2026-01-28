import { expect, test } from "@playwright/test";
import { HomePage } from "../HomePage";

test.describe("Home page navigation", { tag: "@smoke" }, () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.goto();
  });

  test("Home displays game links", async () => {
    const count = await homePage.navigationLinks.count();
    expect(count).toBeGreaterThan(10);
  });

  test("Successful navigation to Checkers from the navigation", async ({
    page,
  }) => {
    await homePage.selectGameByName("Checkers");

    await expect(page).toHaveURL(/\/game\/checkers\/$/);
  });
});
