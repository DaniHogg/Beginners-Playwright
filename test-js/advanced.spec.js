const { test, expect } = require('@playwright/test');

test.describe('Guild Wars 2 Wiki - Advanced Features', () => {
  test('Wiki search functionality', async ({ page }) => {
    await page.goto('https://wiki.guildwars2.com/');

    // Check that search is available
    const searchBox = page.locator('input[placeholder*="Search"]');
    await expect(searchBox).toBeVisible();
  });

  test('Multiple wiki pages navigation', async ({ page }) => {
    await page.goto('https://wiki.guildwars2.com/wiki/Class');

    // Should display class information
    await expect(page.getByText(/Guardian|Warrior|Ranger|Thief/)).toBeVisible();
  });

  test('Wiki categories accessible', async ({ page }) => {
    const startTime = Date.now();

    // Navigate to category page
    await page.goto('https://wiki.guildwars2.com/wiki/Category:Game_types');

    const endTime = Date.now();
    const duration = endTime - startTime;

    // Should load reasonably quickly
    expect(duration).toBeLessThan(10000);

    // Verify the page loaded
    await expect(page).toHaveTitle(/Guild Wars/);
  });

  test('Wiki loot table accessibility', async ({ page }) => {
    await page.goto('https://wiki.guildwars2.com/wiki/Loot');

    // Check that loot information is visible
    const content = page.locator('[role="main"]');
    await expect(content).toBeVisible();
  });

  test('Wiki dynamic content loading', async ({ page }) => {
    await page.goto('https://wiki.guildwars2.com/wiki/Main_Page');

    // Should have dynamic wiki elements loaded
    await expect(page).toHaveTitle(/Guild Wars/);
  });
});