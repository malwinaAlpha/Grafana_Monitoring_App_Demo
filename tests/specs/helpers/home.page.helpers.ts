import { expect } from '@playwright/test';
import { Region, SyntheticsHomePage } from '@page_objects/synthetics.home.page';

export async function verifyRegionFilter(
  homePage: SyntheticsHomePage,
  region: Region,
  previousCount: number
): Promise<number> {
  const currentRegion = await homePage.getCurrentRegionValue();
  expect(currentRegion).toBe(region);

  const currentCount = await homePage.getChecksCount();
  expect(currentCount).toBeLessThanOrEqual(previousCount);
  return currentCount;
}
