const { test, expect } = require('@playwright/test');

test.describe('Guild Wars 2 Wiki MediaWiki Features', () => {
  test('edit links available', async ({ page }) => {
    await page.goto('https://wiki.guildwars2.com/wiki/Main_Page');

    // MediaWiki pages typically have edit links
    const editLink = page.locator('a[href*="action=edit"]').or(
      page.getByText('Edit')
    ).or(
      page.getByText('Edit source')
    );

    await expect(editLink.first()).toBeVisible();
  });

  test('view history available', async ({ page }) => {
    await page.goto('https://wiki.guildwars2.com/wiki/Main_Page');

    // MediaWiki history links
    const historyLink = page.locator('a[href*="action=history"]').or(
      page.getByText('History')
    ).or(
      page.getByText('View history')
    );

    await expect(historyLink.first()).toBeVisible();
  });

  test('recent changes accessible', async ({ page }) => {
    await page.goto('https://wiki.guildwars2.com/wiki/Special:RecentChanges');

    await expect(page).toHaveTitle(/Recent changes/);
    // Should show a list of recent edits
    await expect(page.locator('table')).toBeVisible();
  });

  test('user contributions page available', async ({ page }) => {
    await page.goto('https://wiki.guildwars2.com/wiki/Special:Contributions');

    await expect(page).toHaveTitle(/Contributions/);
    await expect(page.locator('form')).toBeVisible();
  });

  test('category pages functional', async ({ page }) => {
    await page.goto('https://wiki.guildwars2.com/wiki/Category:Items');

    await expect(page).toHaveTitle(/Category:Items/);
    await expect(page.getByText('Items')).toBeVisible();
  });

  test('special pages accessible', async ({ page }) => {
    const specialPages = [
      'Special:AllPages',
      'Special:Categories',
      'Special:Statistics'
    ];

    for (const specialPage of specialPages) {
      await page.goto(`https://wiki.guildwars2.com/wiki/${specialPage}`);
      await expect(page).toHaveTitle(new RegExp(specialPage));
      await expect(page.getByText('does not exist')).not.toBeVisible();
    }
  });
});
