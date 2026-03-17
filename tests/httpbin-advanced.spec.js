const { test, expect } = require('@playwright/test');

test.describe('HTTPBin - Advanced Features', () => {
  test('Headers inspection', async ({ page }) => {
    await page.goto('https://httpbin.org/headers');

    // Check that common headers are present
    await expect(page.getByText('Accept')).toBeVisible();
    await expect(page.getByText('User-Agent')).toBeVisible();
    await expect(page.getByText('Host')).toBeVisible();
  });

  test('Redirect handling', async ({ page }) => {
    await page.goto('https://httpbin.org/redirect/2');

    // Should redirect and show final URL
    await expect(page.getByText('"url": "https://httpbin.org/get"')).toBeVisible();
  });

  test('Delay testing - timing verification', async ({ page }) => {
    const startTime = Date.now();

    // Request with 2 second delay
    await page.goto('https://httpbin.org/delay/2');

    const endTime = Date.now();
    const duration = endTime - startTime;

    // Should take at least 2 seconds (with some tolerance)
    expect(duration).toBeGreaterThan(1900);

    // Verify the delay parameter was received
    await expect(page.getByText('"delay": "2"')).toBeVisible();
  });

  test('Image response handling', async ({ page }) => {
    await page.goto('https://httpbin.org/image/png');

    // Check that an image element exists
    const image = page.locator('img');
    await expect(image).toBeVisible();

    // Verify it's actually an image by checking src attribute
    await expect(image).toHaveAttribute('src', /png/);
  });

  test('Gzip compression test', async ({ page }) => {
    await page.goto('https://httpbin.org/gzip');

    // Should return gzipped content
    await expect(page.getByText('"gzipped": true')).toBeVisible();
    await expect(page.getByText('"method": "GET"')).toBeVisible();
  });
});