const { test, expect } = require('@playwright/test');

test.describe('HTTPBin - Authentication & Security', () => {
  test('Basic authentication - unauthorized access', async ({ page }) => {
    await page.goto('https://httpbin.org/basic-auth/user/passwd');

    // Should show 401 unauthorized
    await expect(page.getByText('401')).toBeVisible();
    await expect(page.getByText('Unauthorized')).toBeVisible();
  });

  test('Basic authentication - successful login', async ({ page }) => {
    // Use correct credentials in URL
    await page.goto('https://user:passwd@httpbin.org/basic-auth/user/passwd');

    // Should show successful authentication
    await expect(page.getByText('"authenticated": true')).toBeVisible();
    await expect(page.getByText('"user": "user"')).toBeVisible();
  });

  test('Cookies - set and retrieve', async ({ page }) => {
    // Set a cookie
    await page.goto('https://httpbin.org/cookies/set?session_id/12345');

    // Verify cookie was set
    await expect(page.getByText('"session_id": "12345"')).toBeVisible();

    // Check cookies on subsequent request
    await page.goto('https://httpbin.org/cookies');
    await expect(page.getByText('"session_id": "12345"')).toBeVisible();
  });
});