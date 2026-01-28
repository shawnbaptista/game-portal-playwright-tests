import { Page, Locator, expect } from "@playwright/test";

export abstract class GamePage {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  get gameName() {
    return this.page.locator("h1");
  }

  get navigation() {
    return this.page.locator("#navigation");
  }

  get navigationLinks() {
    return this.navigation.getByRole("link");
  }

  async selectGameByName(name: string) {
    const selectedGame: Locator = this.navigation.getByRole("link", {
      name: name,
      exact: true,
    });
    await expect(selectedGame).toBeVisible();
    await selectedGame.click();
  }
}
