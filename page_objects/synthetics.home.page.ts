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
  readonly regionSelectedValue: Locator;
  readonly regionOption: (value: string) => Locator;
  readonly title: Locator;
  Region: typeof Region = Region;

  //checks identifiers

  constructor(page: Page) {
    super(page);
    this.regionDropdown = page.locator('[data-testid*="Variable Value DropDown"][data-testid*="input"]').first();
    this.regionSelectedValue = page.locator('[data-testid*="Variable Value DropDown value link text $__all"]').first().locator('div').filter({ hasText: /./ }).first();
    this.regionOption = (value: string) =>
      page.getByRole('option', { name: value });
    this.title = page.locator('h1');
  }

  async navigate(url: string): Promise<void> {
    await this.navigateTo(url);
  }

  async openRegionDropdown(): Promise<void> {
    await this.regionDropdown.click();
  }

  async selectRegion(region: Region): Promise<void> {
    await this.openRegionDropdown();
    await this.regionOption(region).click();
  }

  async getCurrentRegionValue(): Promise<Region> {
    const value = await this.regionSelectedValue.textContent();
    return (value?.trim() ?? 'All') as Region;
  }
}
