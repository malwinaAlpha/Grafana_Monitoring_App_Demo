import { test, expect } from "@playwright/test";
import { SyntheticsHomePage } from "@page_objects/synthetics.home.page";

const SYNTHETICS_HOME_URL = process.env.SYNTHETICS_HOME_URL ?? "";

test.describe("Synthetic Home Page Tests", () => {
  test.beforeEach(async ({ page }) => {
    const homePage = new SyntheticsHomePage(page);
    await homePage.navigate(SYNTHETICS_HOME_URL);
  });

  test("Logged into the Grafana /home", async ({ page }) => {
    const homePage = new SyntheticsHomePage(page);
    await expect(homePage.title).toBeVisible();
  });
});
