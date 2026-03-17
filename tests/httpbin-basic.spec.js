const { test, expect } = require('@playwright/test');

test.describe('HTTPBin - Basic Operations', () => {
  test('homepage loads correctly', async ({ page }) => {
    await page.goto('https://httpbin.org/');
    await expect(page).toHaveTitle(/httpbin/);
    await expect(page.getByText('httpbin')).toBeVisible();
  });

  test('GET request returns correct data', async ({ page }) => {
    await page.goto('https://httpbin.org/get');
    await expect(page.getByText('"url": "https://httpbin.org/get"')).toBeVisible();
    await expect(page.getByText('"method": "GET"')).toBeVisible();
  });

  test('Status code 404 handling', async ({ page }) => {
    await page.goto('https://httpbin.org/status/404');
    await expect(page.getByText('404')).toBeVisible();
  });
});