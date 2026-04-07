import { test, expect } from '@playwright/test';

test.describe('Guild Wars 2 Wiki - Content Access', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the site before each test
    await page.goto('https://wiki.guildwars2.com/');
  });

  test('should display the main heading', async ({ page }) => {
    // Find the heading
    const heading = page.getByText('Guild Wars');
    await expect(heading).toBeVisible();
  });

  test('should have wiki navigation', async ({ page }) => {
    // Find wiki navigation elements
    const nav = page.locator('nav');
    await expect(nav).toBeVisible();
  });

  test('should navigate to wiki pages', async ({ page }) => {
    // Navigate to a wiki page
    await page.goto('https://wiki.guildwars2.com/wiki/Main_Page');
    
    // Wait for page to load and check URL changed
    await page.waitForURL('**/wiki/Main_Page');
    await expect(page).toHaveURL(/Main_Page/);
  });

  test('should find content on wiki', async ({ page }) => {
    // Wiki should have content visible
    const content = page.getByText('Guild Wars 2');
    await expect(content).toBeVisible();
    
    // Verify we're on the wiki
    await expect(page).toHaveURL(/wiki.guildwars2.com/);
  });
});
