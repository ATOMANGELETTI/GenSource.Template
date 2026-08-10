import { test, expect } from '@playwright/test';

test.describe('GenSource Template shell', () => {
  test('renders the product title in the content area', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'GenSource Template' })).toBeVisible();
  });
});
