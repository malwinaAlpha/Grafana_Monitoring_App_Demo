import { test, expect } from '@playwright/test';
import { SyntheticsHomePage } from '@page_objects/synthetics.home.page';
import { verifyRegionFilter } from './helpers/home.page.helpers';

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

    // Select "EMEA" region and verify
    await homePage.selectRegion(homePage.Region.EMEA);
    await verifyRegionFilter(homePage, homePage.Region.EMEA, initialCount);
    await expect(page).toHaveURL(/var-region=EMEA/);

    // Select "AMER" region and verify
    await homePage.selectRegion(homePage.Region.AMER);
    await verifyRegionFilter(homePage, homePage.Region.AMER, initialCount);
    await expect(page).toHaveURL(/var-region=AMER/);
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
