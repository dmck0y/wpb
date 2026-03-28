import { test, expect } from '@playwright/test';

test('debug navigation', async ({ page }) => {
  // Enable console logging
  page.on('console', msg => console.log('BROWSER:', msg.text()));

  // Mock the API
  await page.route('**/api/v1/assets', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        images: [
          { uuid: 'img1', url: 'https://via.placeholder.com/800/FF0000/FFFFFF?text=1', date: '2024-01-01' },
          { uuid: 'img2', url: 'https://via.placeholder.com/800/00FF00/FFFFFF?text=2', date: '2024-01-02' },
          { uuid: 'img3', url: 'https://via.placeholder.com/800/0000FF/FFFFFF?text=3', date: '2024-01-03' },
        ]
      })
    });
  });

  await page.goto('/images');
  await page.waitForTimeout(2000);

  console.log('\n=== Clicking NEXT button ===\n');
  await page.locator('button:has-text("next")').click();
  await page.waitForTimeout(2000);

  console.log('\n=== Current URL:', page.url(), '===\n');
  
  // Take screenshot for debugging
  await page.screenshot({ path: 'debug-after-click.png', fullPage: true });
  
  await page.waitForTimeout(5000);
});
