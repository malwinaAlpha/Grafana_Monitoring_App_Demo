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
  // PAGE IDENTIFICATION

  readonly title: Locator;
  readonly breadcrumb: Locator;
  readonly panelContent: Locator;

  // FILTERS

  readonly regionDropdown: Locator;
  readonly regionSelectedValue: Locator;
  readonly regionOption: (value: string) => Locator;
  readonly probeDropdown: Locator;
  readonly probeAllOption: Locator;
  readonly probeDropdownOptions: (value: string) => Locator;
  readonly clearValueButton: Locator;

  // CHECKS TABLE
  readonly checksTable: Locator;
  readonly tableRows: Locator;
  readonly firstCheckLink: Locator;
  readonly firstCheckName: Locator;

  // PANELS
  readonly mapPanel: Locator;
  readonly latencyPanel: Locator;
  readonly errorPanelContent: Locator;

  // MESSAGES
  readonly noDataMessage: Locator;

  // ENUMS
  readonly Region: typeof Region = Region;

  constructor(page: Page) {
    super(page);

    // PAGE IDENTIFICATION
    this.title = page.locator('h1');
    this.breadcrumb = page.getByRole('link', { name: 'Home' }).first();
    this.panelContent = page.locator(
      '[data-testid="data-testid panel content"]'
    );

    // FILTERS
    this.regionDropdown = page
      .locator('[data-testid*="Variable Value DropDown"][data-testid*="input"]')
      .first();
    this.regionSelectedValue = page
      .locator('[data-testid*="Variable Value DropDown value link text"]')
      .first()
      .locator('div')
      .first();
    this.regionOption = (value: string) =>
      page.getByRole('option', { name: value });

    this.probeDropdown = page
      .locator('[data-testid*="Variable Value DropDown"][data-testid*="input"]')
      .nth(1);
    this.probeDropdownOptions = (value: string) =>
      page.getByRole('option', { name: value });
    this.probeAllOption = this.probeDropdown
      .locator('..')
      .locator('[data-testid*="Variable Value DropDown option"]')
      .getByText('All');
    this.clearValueButton = page.getByRole('button', { name: 'Clear value' });

    // CHECKS TABLE
    this.checksTable = this.panelContent.locator('table').first();
    this.tableRows = this.checksTable.locator('tr');
    this.firstCheckLink = this.panelContent
      .locator('a[data-testid="data-testid Data link"]')
      .first();
    this.firstCheckName = this.panelContent
      .locator('a[data-testid="data-testid Data link"]')
      .nth(1);

    // PANELS
    this.mapPanel = page.getByRole('region', { name: /map/i });
    this.latencyPanel = page.getByRole('region', { name: /latency/i });
    this.errorPanelContent = page.getByRole('region', {
      name: /latency|duration|response/i,
    });

    // MESSAGES
    this.noDataMessage = page.getByRole('status', { name: /no data/i });
  }

  async navigateToSyntheticsHomePage(): Promise<void> {
    await this.navigateTo(SYNTHETICS_HOME_URL);
    await this.panelContent.isVisible();
  }

  async homePageIsVisible(): Promise<void> {
    await expect(this.title).toHaveText('Home');
    await this.breadcrumb.isVisible();
    await this.checksTable.isVisible();
    await this.regionDropdown.isVisible();
    await this.mapPanel.isVisible();
    await this.errorPanelContent.isVisible();
    await this.latencyPanel.isVisible();
  }

  // REGION FILTER ACTIONS
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

  // PROBE FILTER ACTIONS
  async openProbeDropdown(): Promise<void> {
    await this.probeDropdown.isVisible();
    await this.probeDropdown.click({ force: true });
  }

  async selectProbe(probeName: string): Promise<void> {
    await this.openProbeDropdown();
    await this.probeDropdownOptions(probeName).isVisible();
    await this.probeDropdownOptions(probeName).click();
  }

  async clearProbeFilters(): Promise<void> {
    await this.clearValueButton.isVisible();
    await this.clearValueButton.click();
  }

  // CHECKS TABLE ACTIONS
  async getChecksCount(): Promise<number> {
    await this.checksTable.isVisible();
    await this.tableRows.first().waitFor({ state: 'visible' });
    await this.page.waitForTimeout(500);
    const rows = await this.tableRows.all();
    return rows.length;
  }
}
