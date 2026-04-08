import { expect } from '@playwright/test';
import type {
  SyntheticsHomePage,
  Region,
} from '@page_objects/synthetics.home.page';

export async function verifyRegionFilter(
  homePage: SyntheticsHomePage,
  region: Region,
  initialCount: number
): Promise<void> {
  await homePage.selectRegion(region);
  const filteredCount = await homePage.getChecksCount();
  expect(filteredCount).toBeLessThanOrEqual(initialCount);
}
