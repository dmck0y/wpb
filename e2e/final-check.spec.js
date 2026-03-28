import { test, expect } from '@playwright/test';

test('final check - what is happening', async ({ page }) => {
  // Log console
  page.on('console', msg => console.log('BROWSER:', msg.text()));
  
  // Log errors
  page.on('pageerror', error => console.log('ERROR:', error.message));
  
  // Log network
  page.on('response', async response => {
    if (response.url().includes('/api/v1/assets')) {
      console.log('API Response Status:', response.status());
      const body = await response.text();
      console.log('API Response Body (first 200 chars):', body.substring(0, 200));
    }
  });

  await page.goto('http://localhost:8788/images');
  
  await page.waitForTimeout(3000);
  
  // Check what's visible
  const loading = await page.locator('text=loading').isVisible().catch(() => false);
  console.log('\nLoading visible:', loading);
  
  const imageContainer = await page.locator('.image-container').count();
  console.log('Image containers found:', imageContainer);
  
  if (imageContainer > 0) {
    const src = await page.locator('.image-container').first().getAttribute('src');
    console.log('First image src:', src);
  }
  
  const buttons = await page.locator('button').count();
  console.log('Buttons found:', buttons);
  
  await page.screenshot({ path: 'final-check.png', fullPage: true });
});
