const { test, expect } = require('@playwright/test');

test.describe('Guild Wars 2 Wiki Navigation', () => {
  test('sidebar navigation is present', async ({ page }) => {
    await page.goto('https://wiki.guildwars2.com/wiki/Main_Page');

    // MediaWiki sidebar is typically in #mw-panel
    const sidebar = page.locator('#mw-panel').or(page.locator('.sidebar'));
    await expect(sidebar).toBeVisible();

    const navLinks = sidebar.locator('a');
    expect(await navLinks.count()).toBeGreaterThan(0);
  });

  test('footer links are functional', async ({ page }) => {
    await page.goto('https://wiki.guildwars2.com/wiki/Main_Page');

    const footer = page.locator('#footer').or(page.locator('footer'));
    await expect(footer).toBeVisible();

    const footerLinks = footer.locator('a');
    expect(await footerLinks.count()).toBeGreaterThanOrEqual(3);
  });

  test('table of contents navigation works', async ({ page }) => {
    await page.goto('https://wiki.guildwars2.com/wiki/Class');

    const toc = page.locator('#toc').or(page.locator('.toc'));
    await expect(toc).toBeVisible();

    const tocLinks = toc.locator('a');
    expect(await tocLinks.count()).toBeGreaterThan(0);
  });

  test('breadcrumb navigation if present', async ({ page }) => {
    await page.goto('https://wiki.guildwars2.com/wiki/Category:Items');

    const breadcrumbs = page.locator('.breadcrumbs').or(
      page.locator('[class*="breadcrumb"]')
    );

    if (await breadcrumbs.count() > 0) {
      await expect(breadcrumbs).toBeVisible();
      const breadcrumbLinks = breadcrumbs.locator('a');
      expect(await breadcrumbLinks.count()).toBeGreaterThan(0);
    }
  });

  test('navigation menu expansion works', async ({ page }) => {
    await page.goto('https://wiki.guildwars2.com/wiki/Main_Page');

    const collapsible = page.locator('.collapsible').or(
      page.locator('[class*="expandable"]')
    );

    if (await collapsible.count() > 0) {
      await collapsible.first().click();
      await expect(collapsible.first()).toBeVisible();
    }
  });

  test('search navigation integration works', async ({ page }) => {
    await page.goto('https://wiki.guildwars2.com/');

    const searchInput = page.locator('input[type="search"]').or(
      page.locator('#searchInput')
    );

    await expect(searchInput).toBeVisible();
    await searchInput.fill('Guardian');
    await searchInput.press('Enter');

    await expect(page).toHaveURL(/search/);
  });
});
