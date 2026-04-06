import { test, expect } from '@playwright/test';
import { SyntheticsHomePage } from '@page_objects/synthetics.home.page';

test.describe('Synthetic Home Page Tests', () => {
  test.beforeEach(async ({ page }) => {
    const homePage = new SyntheticsHomePage(page);
    await homePage.navigateToSyntheticsHomePage();
    await homePage.homePageIsVisible();
    // // Verify default region is "All"
    let currentRegion = await homePage.getCurrentRegionValue();
    expect(currentRegion).toBe(homePage.Region.ALL);
  });

  test('Filtering checks by region', { tag: ['@smoke'] }, async ({ page }) => {
    const homePage = new SyntheticsHomePage(page);

    // Get initial check count with "All" region
    const initialCount = await homePage.getChecksCount();
    expect(initialCount).toBeGreaterThan(0);

    // Select "EMEA" region and verify
    await homePage.selectRegion(homePage.Region.EMEA);
    let selectedRegion = await homePage.getCurrentRegionValue();
    expect(selectedRegion).toBe(homePage.Region.EMEA);
    await expect(page).toHaveURL(/var-region=EMEA/);

    // Verify that the number of checks changed after filtering (should be less or different)
    const emeaCount = await homePage.getChecksCount();
    expect(emeaCount).toBeLessThan(initialCount);

    //Click the “region” dropdown and select a specific location “AMER”
    await homePage.selectRegion(homePage.Region.AMER);
    let selectedRegionAmer = await homePage.getCurrentRegionValue();
    expect(selectedRegionAmer).toBe(homePage.Region.AMER);
    await expect(page).toHaveURL(/var-region=AMER/);

    const amerCount = await homePage.getChecksCount();
    expect(amerCount).toBeLessThan(initialCount);
  });

  test('Review check details', async ({ page }) => {
    const homePage = new SyntheticsHomePage(page);

    await homePage.homePageIsVisible();
    await page.locator('text="browser-get-pizza"').click();
    await expect(page).toHaveURL(/checks/);
    await expect(
      page.locator('h1:has-text("browser-get-pizza")')
    ).toBeVisible();
    //reachability displayed
    await page.locator('.css-1fxx2s4', { hasText: 'Reachability' });
    await expect(page.locator('text="Frequency"')).toBeVisible();
  });

  test('Handle no data scenario', async ({ page }) => {
    const homePage = new SyntheticsHomePage(page);

    await homePage.homePageIsVisible();

    // Verify that only EMEA checks are displayed
    const tableRows = await homePage.tableRows.all();
    for (const row of tableRows) {
      const regionCell = await row.locator('td.region-column').textContent();
      expect(regionCell).toMatch(/EMEA/);

      // Click the probe filter dropdown
      await homePage.openProbeDropdown();

      // Unselect ALL and select NorthCalifornia
      await homePage.unselectProbeAll();
      await homePage.openProbeDropdown();
      await homePage.selectProbe('NorthCalifornia');

      // Verify no data is displayed
      await expect(homePage.noDataMessage).toBeVisible();
    }
  });
});
