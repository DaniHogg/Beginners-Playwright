const { test, expect } = require('@playwright/test');

test.describe('Guild Wars 2 Wiki Search Results', () => {
  test('basic search returns results', async ({ page }) => {
    await page.goto('https://wiki.guildwars2.com/');

    const searchInput = page.locator('#searchInput').or(
      page.locator('input[name="search"]')
    );

    await expect(searchInput).toBeVisible();
    await searchInput.fill('Ranger');
    await searchInput.press('Enter');

    await expect(page).toHaveURL(/search/);
    await expect(page.getByText('Ranger')).toBeVisible();
  });

  test('search suggestions appear', async ({ page }) => {
    await page.goto('https://wiki.guildwars2.com/');

    const searchInput = page.locator('#searchInput').or(
      page.locator('input[name="search"]')
    );

    await expect(searchInput).toBeVisible();
    await searchInput.fill('Guard');
    await page.waitForTimeout(1000);

    const suggestions = page.locator('.suggestions').or(
      page.locator('[class*="suggest"]')
    );

    if (await suggestions.count() > 0) {
      await expect(suggestions).toBeVisible();
      await expect(suggestions.getByText('Guard')).toBeVisible();
    }
  });

  test('exact page search works', async ({ page }) => {
    await page.goto('https://wiki.guildwars2.com/wiki/Special:Search?search=Main+Page');

    await expect(page.getByText('Main Page')).toBeVisible();
    await expect(page.locator('a[href*="Main_Page"]')).toBeVisible();
  });

  test('no results message displays', async ({ page }) => {
    await page.goto('https://wiki.guildwars2.com/wiki/Special:Search?search=NonExistentTerm12345');

    await expect(page.getByText(/no results|nothing found|did not match/i)).toBeVisible();
  });

  test('category search functionality', async ({ page }) => {
    await page.goto('https://wiki.guildwars2.com/wiki/Category:Items');

    const categorySearch = page.locator('input[placeholder*="Search"]').or(
      page.locator('.search-input')
    );

    if (await categorySearch.count() > 0) {
      await categorySearch.fill('sword');
      await categorySearch.press('Enter');
      await expect(page.getByText(/sword|weapon|item/i)).toBeVisible();
    }
  });

  test('advanced search options are available', async ({ page }) => {
    await page.goto('https://wiki.guildwars2.com/wiki/Special:Search');

    const advancedOptions = page.locator('.advanced-search').or(
      page.locator('[class*="advanced"]')
    );

    if (await advancedOptions.count() > 0) {
      await expect(advancedOptions).toBeVisible();
      const namespaceSelect = page.locator('select[name*="namespace"]');
      if (await namespaceSelect.count() > 0) {
        await expect(namespaceSelect).toBeVisible();
      }
    }
  });

  test('search result pagination works if present', async ({ page }) => {
    await page.goto('https://wiki.guildwars2.com/wiki/Special:Search?search=the');

    const pagination = page.locator('.pagination').or(
      page.locator('[class*="page"]')
    ).or(
      page.locator('a[href*="offset"]')
    );

    if (await pagination.count() > 0) {
      await expect(pagination).toBeVisible();
      const pageLinks = pagination.locator('a');
      expect(await pageLinks.count()).toBeGreaterThan(0);
    }
  });
});
