import { BasePage } from '@page_objects/base.page';
import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';

export enum Region {
  ALL = 'All',
  AMER = 'AMER',
  APAC = 'APAC',
  EMEA = 'EMEA',
}

const SYNTHETICS_HOME_URL = process.env.SYNTHETICS_HOME_URL ?? '';

export class SyntheticsHomePage extends BasePage {
  readonly regionDropdown: Locator;
  readonly regionSelectedValue: Locator;
  readonly regionOption: (value: string) => Locator;

  readonly title: Locator;
  readonly breadcrumb: Locator;
  readonly Region: typeof Region = Region;

  readonly panelContent: Locator;

  readonly reachability: Locator;
  readonly probeDropdown: Locator;
  readonly probeAllOption: Locator;
  readonly checksTable: Locator;
  readonly tableRows: Locator;
  readonly noDataMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.regionDropdown = page
      .locator('[data-testid*="Variable Value DropDown"][data-testid*="input"]')
      .first();
    this.regionSelectedValue = this.regionSelectedValue = page
      .locator('[data-testid*="Variable Value DropDown value link text"]')
      .first()
      .locator('div')
      .first();
    this.regionOption = (value: string) =>
      page.getByRole('option', { name: value });

    this.title = this.page.locator('h1');
    this.breadcrumb = page.getByRole('link', { name: 'Home' });

    this.panelContent = this.page.locator(
      '[data-testid="data-testid panel content"]'
    );
    this.checksTable = this.panelContent.locator('table').first();
    this.tableRows = this.checksTable.locator('tr');
    this.noDataMessage = this.page.getByText('No data');

    this.probeDropdown = this.page.locator(
      '[aria-label="Probe Value Dropdown"]'
    );
    this.probeAllOption = this.page.getByRole('option', { name: 'All' });
    this.reachability = this.page.locator('[aria-label="Reachability"]');
  }

  async navigateToSyntheticsHomePage(): Promise<void> {
    await this.navigateTo(SYNTHETICS_HOME_URL);
    await this.panelContent.isVisible();
  }

  async homePageIsVisible(): Promise<void> {
    await expect(this.title).toHaveText('Home');
    await this.breadcrumb.isVisible();
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
    return (value?.trim() || 'All') as Region;
  }

  async openProbeDropdown(): Promise<void> {
    await this.probeDropdown.click();
  }

  async selectProbeAll(): Promise<void> {
    await this.openProbeDropdown();
    await this.probeAllOption.click();
  }
  async selectProbe(probeName: string): Promise<void> {
    await this.openProbeDropdown();
    await this.page.getByRole('option', { name: probeName }).click();
  }

  async unselectProbeAll(): Promise<void> {
    await this.openProbeDropdown();
    await this.probeAllOption.click();
  }

  async getChecksCount(): Promise<number> {
    await this.checksTable.isVisible();
    await this.page.waitForTimeout(500); //todo replace with wait for network idle or some element state to ensure table is loaded
    const rows = await this.tableRows.all();
    console.log(`Number of checks displayed: ${rows.length}`);
    return rows.length;
  }
}
