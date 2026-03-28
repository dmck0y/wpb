import { test, expect } from '@playwright/test';

test('check what is broken', async ({ page }) => {
  // Enable console logging
  page.on('console', msg => {
    const type = msg.type();
    const text = msg.text();
    console.log(`[${type.toUpperCase()}]`, text);
  });

  // Catch errors
  page.on('pageerror', error => {
    console.log('PAGE ERROR:', error.message);
  });

  await page.goto('http://localhost:5173/');
  
  console.log('\n=== Current URL:', page.url(), '===');
  
  // Wait a bit to see what loads
  await page.waitForTimeout(3000);
  
  // Take a screenshot
  await page.screenshot({ path: 'live-debug.png', fullPage: true });
  
  // Check what's visible
  const body = await page.locator('body').textContent();
  console.log('\n=== Body content:', body?.substring(0, 200), '===\n');
  
  // Check if any images are visible
  const images = await page.locator('img').count();
  console.log('Images found:', images);
  
  // Check if loading text is visible
  const loading = await page.locator('text=loading').isVisible().catch(() => false);
  console.log('Loading visible:', loading);
  
  await page.waitForTimeout(2000);
});
