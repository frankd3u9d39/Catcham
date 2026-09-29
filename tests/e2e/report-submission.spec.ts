import { test, expect } from '@playwright/test';

test('citizen can visit anonymous report portal', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/CATCHAM/);
});
