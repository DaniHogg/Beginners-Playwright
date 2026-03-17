const { test, expect } = require('@playwright/test');

test.describe('HTTPBin - Form Testing', () => {
  test('POST request with form data', async ({ page }) => {
    await page.goto('https://httpbin.org/forms/post');

    // Fill out the pizza order form
    await page.fill('input[name="custname"]', 'John Doe');
    await page.fill('input[name="custtel"]', '555-1234');
    await page.fill('input[name="custemail"]', 'john@example.com');
    await page.selectOption('select[name="size"]', 'large');
    await page.check('input[name="topping"][value="bacon"]');
    await page.fill('textarea[name="comments"]', 'Extra cheese please');

    await page.click('input[type="submit"]');

    // Verify the form data was submitted correctly
    await expect(page.getByText('"custname": "John Doe"')).toBeVisible();
    await expect(page.getByText('"method": "POST"')).toBeVisible();
  });

  test('JSON POST request', async ({ page }) => {
    await page.goto('https://httpbin.org/post');

    // Submit JSON data
    await page.fill('textarea', '{"name": "John", "age": 30, "city": "New York"}');
    await page.click('input[type="submit"]');

    // Verify JSON was received and parsed
    await expect(page.getByText('"name": "John"')).toBeVisible();
    await expect(page.getByText('"age": 30')).toBeVisible();
    await expect(page.getByText('"city": "New York"')).toBeVisible();
  });
});