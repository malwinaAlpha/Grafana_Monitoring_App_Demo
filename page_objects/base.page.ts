import type { Page } from '@playwright/test';

export class BasePage {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  protected async navigateTo(url: string): Promise<void> {
    await this.page.goto(url);
  }

  protected async waitForSelector(selector: string): Promise<void> {
    await this.page.waitForSelector(selector);
  }

  protected async isVisible(selector: string): Promise<boolean> {
    return this.page.isVisible(selector);
  }
}
