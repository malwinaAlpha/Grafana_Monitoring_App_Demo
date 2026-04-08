import { expect } from '@playwright/test';
import { verifyRegionFilter } from '../../helpers/home.page.helpers';
import { SyntheticsHomePage } from '@page_objects/synthetics.home.page';
import { SyntheticsChecksPage } from '@page_objects/synthetics.checks.page';
import test from '@fixtures/pages.fixture';

declare module '@playwright/test' {
  interface TestFixtures {
    homePage: SyntheticsHomePage;
    checksPage: SyntheticsChecksPage;
  }
}

test.describe('Synthetic Home Page Tests', () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.homePageIsVisible();
    // // Verify default region is "All"
    let currentRegion = await homePage.getCurrentRegionValue();
    expect(currentRegion).toBe(homePage.Region.ALL);
  });

  test(
    'Filtering checks by region',
    { tag: ['@smoke'] },
    async ({ homePage }) => {
      const initialCount = await homePage.getChecksCount();

      await homePage.selectRegion(homePage.Region.EMEA);
      await verifyRegionFilter(homePage, homePage.Region.EMEA, initialCount);
      await expect(homePage.getPage()).toHaveURL(/var-region=EMEA/);

      await homePage.selectRegion(homePage.Region.AMER);
      await verifyRegionFilter(homePage, homePage.Region.AMER, initialCount);
      await expect(homePage.getPage()).toHaveURL(/var-region=AMER/);
    }
  );

  test(
    'Review check details',
    { tag: ['@smoke'] },
    async ({ homePage, checksPage }) => {
      await homePage.homePageIsVisible();

      // Get the first check name from the table
      const checkName = await homePage.firstCheckName.textContent();
      expect(checkName).toBeTruthy();

      // Click on the first check link
      await homePage.firstCheckLink.click({ force: true });
      await expect(homePage.getPage()).toHaveURL(/checks\/\d+/);

      // Verify we're on the check details page and check name is displayed
      await checksPage.verifyReachabilityIsVisible();
      await checksPage.verifyUptimeIsVisible();
      expect(checkName).toBeDefined();
      await expect(checksPage.title).toHaveText(checkName as string);
    }
  );

  test(
    'Handle no data scenario',
    { tag: ['@regression'] },
    async ({ homePage }) => {
      await homePage.homePageIsVisible();

      await homePage.selectRegion(homePage.Region.EMEA);
      await expect(homePage.getPage()).toHaveURL(/var-region=EMEA/);

      // Unselect ALL and select NorthCalifornia
      await homePage.clearProbeFilters();
      await homePage.selectProbe('NorthCalifornia');
      // Verify no data is displayed
      await homePage.noDataMessage.isVisible();
    }
  );
});
