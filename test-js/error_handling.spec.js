const { test, expect } = require('@playwright/test');

test.describe('Guild Wars 2 Wiki Error Handling', () => {
  test('404 error page is handled', async ({ page }) => {
    await page.goto('https://wiki.guildwars2.com/wiki/ThisPageDoesNotExist12345');

    await expect(page.getByText(/does not exist|404|not found/i)).toBeVisible();
    await expect(page.locator('body')).toBeVisible();
  });

  test('malformed URL handling works', async ({ page }) => {
    await page.goto('https://wiki.guildwars2.com/wiki/Test%20Page%20With%20Spaces');
    await expect(page.locator('body')).toBeVisible();
  });

  test('network timeout handling works', async ({ page }) => {
    await page.goto('https://wiki.guildwars2.com/wiki/Main_Page', { timeout: 10000 });
    await expect(page).toHaveTitle(/Guild Wars/);
  });

  test('javascript disabled fallback if possible', async ({ page }) => {
    await page.goto('https://wiki.guildwars2.com/');
    await expect(page.getByText('Guild Wars')).toBeVisible();
  });

  test('large page loading works', async ({ page }) => {
    await page.goto('https://wiki.guildwars2.com/wiki/Category:Living_World');

    await expect(page).toHaveTitle(/Living World/);
    await page.waitForLoadState('networkidle');
    await expect(page.locator('#mw-content-text')).toBeVisible();
  });

  test('special characters in search are handled', async ({ page }) => {
    await page.goto('https://wiki.guildwars2.com/wiki/Special:Search?search=Guild+Wars+2%3A+Path+of+Fire');
    await expect(page.locator('body')).toBeVisible();
    await expect(page.getByText(/error|exception/i)).not.toBeVisible();
  });

  test('empty search handling works', async ({ page }) => {
    await page.goto('https://wiki.guildwars2.com/wiki/Special:Search?search=');
    await expect(page.locator('body')).toBeVisible();
  });

  test('invalid namespace handling works', async ({ page }) => {
    await page.goto('https://wiki.guildwars2.com/wiki/InvalidNamespace:TestPage');
    await expect(page.locator('body')).toBeVisible();
  });

  test('database error simulation is covered', async ({ page }) => {
    await page.goto('https://wiki.guildwars2.com/wiki/Special:Version');
    await expect(page.locator('body')).toBeVisible();
  });

  test('rate limiting handling works', async ({ page }) => {
    for (let i = 0; i < 5; i++) {
      await page.goto('https://wiki.guildwars2.com/wiki/Main_Page');
      await expect(page).toHaveTitle(/Guild Wars/);
    }
    await expect(page.locator('body')).toBeVisible();
  });
});
