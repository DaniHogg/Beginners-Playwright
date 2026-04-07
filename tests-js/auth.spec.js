const { test, expect } = require('@playwright/test');

test.describe('Guild Wars 2 Wiki - Access & Navigation', () => {
  test('Wiki homepage accessible', async ({ page }) => {
    await page.goto('https://wiki.guildwars2.com/');

    // Should show wiki homepage
    await expect(page).toHaveTitle(/Guild Wars/);
    await expect(page.getByText('Guild Wars 2')).toBeVisible();
  });

  test('Wiki main page accessible', async ({ page }) => {
    // Navigate to main page
    await page.goto('https://wiki.guildwars2.com/wiki/Main_Page');

    // Should show main page content
    await expect(page).toHaveTitle(/Guild Wars/);
    await expect(page.getByText('Main')).toBeVisible();
  });

  test('Wiki multiple regions content', async ({ page }) => {
    // Test accessing regional content
    await page.goto('https://wiki.guildwars2.com/wiki/World');

    // Should show world information
    await expect(page.getByText(/World|Map|Region/)).toBeVisible();
  });

  test('Wiki persistent navigation', async ({ page }) => {
    // Navigate and stay on wiki
    await page.goto('https://wiki.guildwars2.com/');
    await expect(page).toHaveURL(/wiki.guildwars2.com/);
  });
});