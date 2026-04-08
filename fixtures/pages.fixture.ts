import { test as baseTest } from '@playwright/test';
import { SyntheticsHomePage } from '@page_objects/synthetics.home.page';
import { SyntheticsChecksPage } from '@page_objects/synthetics.checks.page';

const SYNTHETICS_HOME_URL = process.env.SYNTHETICS_HOME_URL ?? '';

// Define the type for the fixtures
type Fixtures = {
  homePage: SyntheticsHomePage;
  checksPage: SyntheticsChecksPage;
};

// Extend the base test with the fixtures
const test = baseTest.extend<Fixtures>({
  homePage: async ({ page }, use) => {
    const homePage = new SyntheticsHomePage(page);
    await homePage.navigateTo(SYNTHETICS_HOME_URL);
    await use(homePage);
  },
  checksPage: async ({ page }, use) => {
    const checksPage = new SyntheticsChecksPage(page);
    await use(checksPage);
  },
});

export default test;
