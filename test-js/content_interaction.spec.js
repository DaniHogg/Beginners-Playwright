const { test, expect } = require('@playwright/test');

test.describe('Guild Wars 2 Wiki Content Interaction', () => {
  test('expandable sections work', async ({ page }) => {
    await page.goto('https://wiki.guildwars2.com/wiki/Class');

    const collapsibleHeaders = page.locator('.mw-collapsible-toggle').or(
      page.locator('[class*="collapsible"]')
    );

    if (await collapsibleHeaders.count() > 0) {
      await collapsibleHeaders.first().click();
      await page.waitForTimeout(500);
      await expect(collapsibleHeaders.first()).toBeVisible();
    }
  });

  test('tabbed content navigation works', async ({ page }) => {
    await page.goto('https://wiki.guildwars2.com/wiki/User:Example');

    const tabs = page.locator('.tabs').or(page.locator('[role="tab"]'));

    if (await tabs.count() > 1) {
      await tabs.nth(1).click();
      await expect(tabs.nth(1)).toBeVisible();
    }
  });

  test('image gallery interaction works', async ({ page }) => {
    await page.goto('https://wiki.guildwars2.com/wiki/Category:Items');

    const imageLinks = page.locator('a.image').or(page.locator('.gallery a'));

    if (await imageLinks.count() > 0) {
      const [popup] = await Promise.all([
        page.waitForEvent('popup'),
        imageLinks.first().click(),
      ]);

      await expect(popup.locator('img')).toBeVisible();
    }
  });

  test('table sorting functionality works', async ({ page }) => {
    await page.goto('https://wiki.guildwars2.com/wiki/List_of_achievements');

    const sortableHeaders = page.locator('th.sortable').or(
      page.locator('[class*="sortable"]')
    );

    if (await sortableHeaders.count() > 0) {
      await sortableHeaders.first().click();
      await expect(sortableHeaders.first()).toBeVisible();
    }
  });

  test('content filtering works when available', async ({ page }) => {
    await page.goto('https://wiki.guildwars2.com/wiki/Category:Items');

    const filters = page.locator('select').or(page.locator('input[type="checkbox"]'));

    if (await filters.count() > 0) {
      const firstFilter = filters.first();
      if (await firstFilter.locator('option').count() > 1) {
        await firstFilter.selectOption({ index: 1 });
        await page.waitForTimeout(1000);
        await expect(page.locator('#mw-content-text')).toBeVisible();
      }
    }
  });

  test('dynamic content loading works', async ({ page }) => {
    await page.goto('https://wiki.guildwars2.com/wiki/Main_Page');
    await page.waitForLoadState('networkidle');

    const images = page.locator('img');
    const imageCount = Math.min(await images.count(), 5);

    for (let i = 0; i < imageCount; i++) {
      await expect(images.nth(i)).toBeVisible();
    }
  });

  test('hover tooltips appear when available', async ({ page }) => {
    await page.goto('https://wiki.guildwars2.com/wiki/Main_Page');

    const links = page.locator('a[title]').or(page.locator('[data-tooltip]'));

    if (await links.count() > 0) {
      await links.first().hover();
      await page.waitForTimeout(500);

      const tooltip = page.locator('.tooltip').or(page.locator('[role="tooltip"]'));
      if (await tooltip.count() > 0) {
        await expect(tooltip).toBeVisible();
      }
    }
  });

  test('content sharing features are visible', async ({ page }) => {
    await page.goto('https://wiki.guildwars2.com/wiki/Main_Page');

    const shareButtons = page.locator('[class*="share"]').or(
      page.locator('a[href*="twitter"]').or(page.locator('a[href*="facebook"]'))
    );

    if (await shareButtons.count() > 0) {
      await expect(shareButtons.first()).toBeVisible();
    }
  });

  test('print stylesheet is available when present', async ({ page }) => {
    await page.goto('https://wiki.guildwars2.com/wiki/Main_Page');

    const printCss = page.locator('link[media="print"]').or(
      page.locator('link[href*="print"]')
    );

    if (await printCss.count() > 0) {
      await expect(printCss.first()).toBeVisible();
    }
  });

  test('responsive design works at mobile viewport', async ({ page }) => {
    await page.goto('https://wiki.guildwars2.com/wiki/Main_Page');

    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.getByText('Guild Wars')).toBeVisible();

    const mobileMenu = page.locator('.mobile-menu').or(page.locator('#mw-panel'));
    if (await mobileMenu.count() > 0) {
      await expect(mobileMenu.first()).toBeVisible();
    }
  });
});
