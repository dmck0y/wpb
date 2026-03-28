import { test } from '@playwright/test';

test('debug network requests', async ({ page }) => {
  // Log all network requests
  page.on('request', request => {
    console.log('REQUEST:', request.method(), request.url());
  });

  page.on('response', response => {
    console.log('RESPONSE:', response.status(), response.url());
  });

  page.on('requestfailed', request => {
    console.log('REQUEST FAILED:', request.url(), request.failure()?.errorText);
  });

  await page.goto('http://localhost:5173/');
  await page.waitForTimeout(5000);
});
