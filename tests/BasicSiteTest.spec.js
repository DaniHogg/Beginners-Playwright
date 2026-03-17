import { test, expect } from '@playwright/test';

test.describe('Learning Playwright - Documentation Site', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the site before each test
    await page.goto('https://playwright.dev/');
  });

  test('should display the main heading', async ({ page }) => {
    // Find the heading using accessible selector
    const heading = page.getByRole('heading', { name: /Playwright/ });
    await expect(heading).toBeVisible();
  });

  test('should have a working search box', async ({ page }) => {
    // Find search input by placeholder
    const searchBox = page.getByPlaceholder('Search');
    await expect(searchBox).toBeVisible();
  });

  test('should navigate to documentation', async ({ page }) => {
    // Click the "Get started" link
    await page.getByRole('link', { name: /Getting started/ }).click();
    
    // Wait for page to load and check URL changed
    await page.waitForURL('**/docs/intro**');
    await expect(page).toHaveURL(/\/docs\//);
  });

  test('should find and click on a specific feature', async ({ page }) => {
    // Find a link by text and click it
    const link = page.getByRole('link', { name: /API testing/ });
    await expect(link).toBeVisible();
    await link.click();
    
    // Verify we navigated
    await expect(page).toHaveURL(/API/);
  });
});
