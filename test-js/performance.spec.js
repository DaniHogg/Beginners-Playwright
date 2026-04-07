const { test, expect } = require('@playwright/test');

test.describe('Guild Wars 2 Wiki - Performance Tests', () => {
  
  test('Page loads quickly', async ({ page }) => {
    /**
     * Test that the Guild Wars 2 Wiki homepage loads within a reasonable time.
     * 
     * How it works:
     * 1. Start a timer (const startTime = Date.now())
     * 2. Navigate to the page using page.goto()
     * 3. Calculate elapsed time: Date.now() - startTime
     * 4. Assert that load_time < 5000 milliseconds (5 seconds)
     */
    const startTime = Date.now();
    await page.goto('https://wiki.guildwars2.com/');
    const loadTime = Date.now() - startTime;
    
    // Verify the page actually loaded
    await expect(page).toHaveTitle(/Guild Wars/);
    
    // Assert page loaded within 5 seconds (5000 milliseconds)
    expect(loadTime).toBeLessThan(5000);
    console.log(`Page loaded in ${loadTime}ms`);
  });

  test('Wiki main page loads quickly', async ({ page }) => {
    /**
     * Test that the Wiki main page loads quickly.
     * Similar to above but specifically for the Main_Page
     */
    const startTime = Date.now();
    await page.goto('https://wiki.guildwars2.com/wiki/Main_Page');
    const loadTime = Date.now() - startTime;
    
    await expect(page).toHaveTitle(/Guild Wars/);
    expect(loadTime).toBeLessThan(5000);
    console.log(`Main page loaded in ${loadTime}ms`);
  });

  test('Multiple page navigation speed', async ({ page }) => {
    /**
     * Test that navigating between multiple pages is performant.
     * This tests a realistic user journey of clicking through multiple pages
     */
    const pagesToTest = [
      'https://wiki.guildwars2.com/',
      'https://wiki.guildwars2.com/wiki/Main_Page',
      'https://wiki.guildwars2.com/wiki/Class',
    ];
    
    let totalTime = 0;
    
    for (const url of pagesToTest) {
      const startTime = Date.now();
      await page.goto(url);
      const loadTime = Date.now() - startTime;
      totalTime += loadTime;
      
      console.log(`Loaded ${url} in ${loadTime}ms`);
      
      // Each page should load in under 5 seconds
      expect(loadTime).toBeLessThan(5000);
    }
    
    const avgTime = totalTime / pagesToTest.length;
    console.log(`Average load time: ${avgTime.toFixed(2)}ms`);
    
    // Average across all pages should be under 4 seconds
    expect(avgTime).toBeLessThan(4000);
  });
});
