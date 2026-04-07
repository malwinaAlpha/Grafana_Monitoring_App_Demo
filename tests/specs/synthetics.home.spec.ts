import { test, expect } from '@playwright/test';
import { SyntheticsHomePage } from '@page_objects/synthetics.home.page';
import { SyntheticsChecksPage } from '@page_objects/synthetics.checks.page';
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
    const checksPage = new SyntheticsChecksPage(page);

    await homePage.homePageIsVisible();

    // Get the first check name from the table
    const checkName = await homePage.firstCheckName.textContent();
    expect(checkName).toBeTruthy();

    // Click on the first check link
    await homePage.firstCheckLink.click({ force: true });
    await expect(page).toHaveURL(/checks\/\d+/);

    // Verify we're on the check details page and check name is displayed
    await checksPage.verifyReachabilityIsVisible();
    await checksPage.verifyUptimeIsVisible();
    expect(checkName).toBeDefined();
    await expect(checksPage.title).toHaveText(checkName as string);
  });

  test('Handle no data scenario', async ({ page }) => {
    const homePage = new SyntheticsHomePage(page);

    await homePage.homePageIsVisible();

    await homePage.selectRegion(homePage.Region.EMEA);
    await expect(page).toHaveURL(/var-region=EMEA/);

    // Unselect ALL and select NorthCalifornia
    await homePage.clearProbeFilters();
    await homePage.selectProbe('NorthCalifornia');
    // Verify no data is displayed
    await expect(homePage.noDataMessage).toBeVisible();
  });
});
