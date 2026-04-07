import { BasePage } from '@page_objects/base.page';
import type { Locator, Page } from '@playwright/test';

export class SyntheticsChecksPage extends BasePage {
  readonly uptimeHeader: Locator;
  readonly reachabilityHeader: Locator;
  readonly title: Locator;

  constructor(page: Page) {
    super(page);
    this.uptimeHeader = page.getByRole('region', { name: /uptime/i });
    this.reachabilityHeader = page.getByRole('heading', {
      name: /reachability/i,
    });
    this.title = page.locator('h1');
  }

  async verifyUptimeIsVisible(): Promise<void> {
    await this.uptimeHeader.isVisible();
  }

  async verifyReachabilityIsVisible(): Promise<void> {
    await this.reachabilityHeader.isVisible();
  }
}
