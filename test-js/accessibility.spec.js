const { test, expect } = require('@playwright/test');

test.describe('Guild Wars 2 Wiki Accessibility', () => {
  test('images have alt text', async ({ page }) => {
    await page.goto('https://wiki.guildwars2.com/wiki/Main_Page');

    const images = page.locator('img');
    const imageCount = await images.count();

    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i);
      const altText = await img.getAttribute('alt');
      expect(altText).not.toBeNull();
      expect(altText.trim().length).toBeGreaterThan(0);
    }
  });

  test('headings have proper hierarchy', async ({ page }) => {
    await page.goto('https://wiki.guildwars2.com/wiki/Main_Page');

    const h1Headings = page.locator('h1');
    expect(await h1Headings.count()).toBeGreaterThan(0);

    const headings = page.locator('h1, h2, h3, h4, h5, h6');
    const headingLevels = [];
    const headingCount = await headings.count();

    for (let i = 0; i < headingCount; i++) {
      const tagName = await headings.nth(i).evaluate(el => el.tagName.toLowerCase());
      headingLevels.push(parseInt(tagName[1], 10));
    }

    for (let i = 1; i < headingLevels.length; i++) {
      expect(headingLevels[i]).toBeLessThanOrEqual(headingLevels[i - 1] + 2);
    }
  });

  test('form elements have labels', async ({ page }) => {
    await page.goto('https://wiki.guildwars2.com/wiki/Special:Search');

    const inputs = page.locator('input[type="text"], input[type="search"], textarea');
    const inputCount = await inputs.count();

    for (let i = 0; i < inputCount; i++) {
      const inputElement = inputs.nth(i);
      const label = inputElement.locator('xpath=ancestor::label').first();
      const ariaLabel = await inputElement.getAttribute('aria-label');
      const ariaLabelledBy = await inputElement.getAttribute('aria-labelledby');
      const labelCount = await label.count();

      const hasLabel = labelCount > 0 ||
        (ariaLabel && ariaLabel.trim().length > 0) ||
        (ariaLabelledBy && ariaLabelledBy.trim().length > 0);

      expect(hasLabel).toBe(true);
    }
  });

  test('keyboard navigation works', async ({ page }) => {
    await page.goto('https://wiki.guildwars2.com/');

    const searchInput = page.locator('#searchInput').or(
      page.locator('input[name="search"]')
    );

    await searchInput.focus();
    await expect(searchInput).toBeFocused();

    await page.keyboard.press('Tab');
    const activeElement = page.locator(':focus');
    await expect(activeElement).toBeVisible();
  });

  test('color contrast indicators exist', async ({ page }) => {
    await page.goto('https://wiki.guildwars2.com/wiki/Main_Page');

    const links = page.locator('a');
    const regularText = page.locator('p').first();

    if (await links.count() > 0 && await regularText.count() > 0) {
      const linkColor = await links.first().evaluate(el => getComputedStyle(el).color);
      const textColor = await regularText.evaluate(el => getComputedStyle(el).color);
      expect(linkColor).not.toBe(textColor);
    }
  });

  test('skip links are available', async ({ page }) => {
    await page.goto('https://wiki.guildwars2.com/wiki/Main_Page');

    const skipLinks = page.locator('a[href^="#"]').filter({ hasText: /skip|jump/i });
    if (await skipLinks.count() > 0) {
      await expect(skipLinks.first()).toBeVisible();
      await skipLinks.first().focus();
      await expect(skipLinks.first()).toBeFocused();
    }
  });

  test('lang attribute is present', async ({ page }) => {
    await page.goto('https://wiki.guildwars2.com/');

    const htmlElement = page.locator('html');
    const langAttr = await htmlElement.getAttribute('lang');
    expect(langAttr).not.toBeNull();
    expect(langAttr.trim().length).toBeGreaterThan(0);
  });

  test('table headers are properly associated', async ({ page }) => {
    await page.goto('https://wiki.guildwars2.com/wiki/Category:Items');

    const tables = page.locator('table');
    const tableCount = await tables.count();

    for (let i = 0; i < tableCount; i++) {
      const table = tables.nth(i);
      const headers = table.locator('th');
      const headerCount = await headers.count();

      if (headerCount > 0) {
        for (let j = 0; j < headerCount; j++) {
          const header = headers.nth(j);
          const scope = await header.getAttribute('scope');
          const headersAttr = await header.getAttribute('headers');
          expect(scope || headersAttr).toBeTruthy();
        }
      }
    }
  });
});
