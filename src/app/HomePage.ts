import { expect, Page, Locator } from '@playwright/test';

export class HomePage {
    private readonly navigation: Locator;

    constructor(private readonly page: Page) { 
        this.navigation = this.page.locator("p.homeNavigation")
    }
    
    async goto() {
        await this.page.goto('/');
    }

    navigationLinks() {
        return this.navigation.getByRole("link");
    }

    async selectGameByName(name: string) {
        const selectedGame: Locator = this.navigation.getByRole("link", { name: name, exact: true })
        await expect(selectedGame).toBeVisible()
        await selectedGame.click()
    }

}