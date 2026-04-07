import type { Page } from '@playwright/test';

export class BasePage {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  public async navigateTo(url: string): Promise<void> {
    await this.page.goto(url);
  }

  public getPage(): Page {
    return this.page;
  }
}
