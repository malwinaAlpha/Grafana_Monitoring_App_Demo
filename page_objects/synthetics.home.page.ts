import { BasePage } from '@page_objects/base.page';
import type { Locator, Page } from '@playwright/test';

export enum Region {
  ALL = 'All',
  AMER = 'AMER',
  APAC = 'APAC',
  EMEA = 'EMEA',
}

export class SyntheticsHomePage extends BasePage {
  //filters
  readonly regionDropdown: Locator;
  readonly regionOption: (value: string) => Locator;
  readonly title: Locator;

  //checks identifiers

  constructor(page: Page) {
    super(page);
    this.regionDropdown = page.getByRole('button', { name: /region/i });
    this.regionOption = (value: string) =>
      page.getByRole('option', { name: value });
    this.title = page.locator('h1');
  }

  async navigate(url: string): Promise<void> {
    await this.navigateTo(url);
  }

  async openRegionDropdown(): Promise<void> {
    await this.regionDropdown.click();
    await this.regionOption(Region.AMER).waitFor();
  }

  async selectRegion(region: Region): Promise<void> {
    await this.openRegionDropdown();
    await this.regionOption(region).click();
  }

  async getCurrentRegionValue(): Promise<Region> {
    const value = await this.regionDropdown.textContent();
    return (value?.trim() ?? 'All') as Region;
  }
}
