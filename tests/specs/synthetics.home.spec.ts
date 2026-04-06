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

  test('Filtering checks by region', async ({ page }) => {
    const homePage = new SyntheticsHomePage(page);

    // Select "EMEA" region and verify
    await homePage.selectRegion(homePage.Region.EMEA);
    let selectedRegion = await homePage.getCurrentRegionValue();
    expect(selectedRegion).toBe(homePage.Region.EMEA);

    //Click on the AMER region and verify the selection
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

    // Click the region dropdown and select EMEA
    //await homePage.openRegionDropdown();

    // Verify that only EMEA checks are displayed
    const tableRows = await page.locator('table tr').all();
    for (const row of tableRows) {
      const regionCell = await row.locator('td.region-column').textContent();
      expect(regionCell).toMatch(/EMEA/);

      // Click the probe filter dropdown
      await homePage.openProbeDropdown();

      // Unselect ALL and select NorthCalifornia
      await homePage.unselectProbeAll();
      await homePage.openProbeDropdown();
      await homePage.selectProbe('NorthCalifornia'); // se nececita algun click fuera de la dropdown

      // Verify no data is displayed
      const noDataMessage = page.locator('text=No data');
      await expect(noDataMessage).toBeVisible();
    }
  });
});
