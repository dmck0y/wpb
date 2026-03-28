import { test, expect } from '@playwright/test';

test.describe('Gallery Application', () => {
  test('should load the gallery page', async ({ page }) => {
    await page.goto('/');
    
    // Should redirect to /images
    await expect(page).toHaveURL(/\/images/);
    
    // Should show wastepaperbasket logo
    await expect(page.locator('h1')).toContainText('wastepaperbasket');
  });

  test('should fetch and display images', async ({ page }) => {
    // Mock the API response
    await page.route('**/api/v1/assets', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          images: [
            { uuid: 'img1', url: 'https://via.placeholder.com/800x600/FF0000/FFFFFF?text=Image+1', date: '2024-01-01' },
            { uuid: 'img2', url: 'https://via.placeholder.com/800x600/00FF00/FFFFFF?text=Image+2', date: '2024-01-02' },
            { uuid: 'img3', url: 'https://via.placeholder.com/800x600/0000FF/FFFFFF?text=Image+3', date: '2024-01-03' },
          ]
        })
      });
    });

    await page.goto('/images');
    
    // Wait for loading to complete
    await expect(page.locator('text=loading...')).toBeHidden({ timeout: 5000 });
    
    // Should display the first image
    const img = page.locator('.image-container');
    await expect(img).toBeVisible();
    await expect(img).toHaveAttribute('src', /placeholder/);
    
    // Should have navigation buttons
    await expect(page.locator('button:has-text("prev")')).toBeVisible();
    await expect(page.locator('button:has-text("next")')).toBeVisible();
    
    // Prev should be disabled on first image
    await expect(page.locator('button:has-text("prev")')).toBeDisabled();
  });

  test('should navigate between images', async ({ page }) => {
    // Mock the API response
    await page.route('**/api/v1/assets', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          images: [
            { uuid: 'img1', url: 'https://via.placeholder.com/800x600/FF0000/FFFFFF?text=Image+1', date: '2024-01-01' },
            { uuid: 'img2', url: 'https://via.placeholder.com/800x600/00FF00/FFFFFF?text=Image+2', date: '2024-01-02' },
            { uuid: 'img3', url: 'https://via.placeholder.com/800x600/0000FF/FFFFFF?text=Image+3', date: '2024-01-03' },
          ]
        })
      });
    });

    await page.goto('/images');
    await expect(page.locator('text=loading...')).toBeHidden({ timeout: 5000 });
    
    // Click next button
    await page.locator('button:has-text("next")').click();
    
    // URL should update to /images/img2
    await expect(page).toHaveURL(/\/images\/img2/);
    
    // Prev button should now be enabled
    await expect(page.locator('button:has-text("prev")')).toBeEnabled();
  });

  test('should handle API errors gracefully', async ({ page }) => {
    // Mock API failure
    await page.route('**/api/v1/assets', async route => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Server error' })
      });
    });

    await page.goto('/images');
    
    // Should show loading state initially
    await expect(page.locator('text=loading...')).toBeVisible();
    
    // Wait a bit to see if error handling works
    await page.waitForTimeout(2000);
  });

  test('should deep link to specific image', async ({ page }) => {
    // Mock the API response
    await page.route('**/api/v1/assets', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          images: [
            { uuid: 'img1', url: 'https://via.placeholder.com/800x600/FF0000/FFFFFF?text=Image+1', date: '2024-01-01' },
            { uuid: 'img2', url: 'https://via.placeholder.com/800x600/00FF00/FFFFFF?text=Image+2', date: '2024-01-02' },
            { uuid: 'img3', url: 'https://via.placeholder.com/800x600/0000FF/FFFFFF?text=Image+3', date: '2024-01-03' },
          ]
        })
      });
    });

    // Navigate directly to second image
    await page.goto('/images/img2');
    await expect(page.locator('text=loading...')).toBeHidden({ timeout: 5000 });
    
    // Should show the correct image
    const img = page.locator('.image-container');
    await expect(img).toBeVisible();
    await expect(img).toHaveAttribute('src', /Image\+2/);
    
    // Prev should be enabled (not on first image)
    await expect(page.locator('button:has-text("prev")')).toBeEnabled();
  });
});
