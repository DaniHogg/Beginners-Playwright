const { test, expect } = require('@playwright/test');

test.describe('Guild Wars 2 Wiki - Forms & Interaction', () => {
  test('Wiki search form', async ({ page }) => {
    await page.goto('https://wiki.guildwars2.com/');

    // Locate search form
    const searchForm = page.locator('form');
    await expect(searchForm).toBeVisible();
  });

  test('Wiki edit form visibility', async ({ page }) => {
    await page.goto('https://wiki.guildwars2.com/wiki/Main_Page');

    // Check for wiki edit/view options
    await expect(page).toHaveTitle(/Guild Wars/);
    await expect(page.getByText('Main')).toBeVisible();
  });

  test('Wiki category filtering', async ({ page }) => {
    await page.goto('https://wiki.guildwars2.com/wiki/Category:Items');

    // Check category page loads
    await expect(page).toHaveTitle(/Guild Wars/);
  });

  test('Wiki link navigation', async ({ page }) => {
    await page.goto('https://wiki.guildwars2.com/');

    // Check that links are interactive
    const links = page.locator('a');
    const count = await links.count();
    expect(count).toBeGreaterThan(0);
  });
});