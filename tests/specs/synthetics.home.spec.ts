import { test, expect } from '@playwright/test';
import { SyntheticsHomePage } from '@page_objects/synthetics.home.page';

const SYNTHETICS_HOME_URL = process.env.SYNTHETICS_HOME_URL ?? '';

test.describe('Synthetic Home Page Tests', () => {
  test.beforeEach(async ({ page }) => {
    const homePage = new SyntheticsHomePage(page);
    await homePage.navigate(SYNTHETICS_HOME_URL);
  });

  test('Filtering checks by region', async ({ page }) => {
    const homePage = new SyntheticsHomePage(page);
    await expect(homePage.title).toBeVisible();

    // Verify default region is "All"
    let currentRegion = await homePage.getCurrentRegionValue();
    expect(currentRegion).toBe(homePage.Region.ALL);

    // Select "EMEA" region and verify
    await homePage.openRegionDropdown();
  });
});
